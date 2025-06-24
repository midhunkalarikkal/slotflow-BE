import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { aws_s3Config } from "../../config/env";
import { generateSignedUrl } from "../../config/aws_s3";
import { extractS3Key } from "../../infrastructure/helpers/helper";
import { validateOrThrow, Validator } from "../../infrastructure/validator/validator";
import { UserRepositoryImpl } from "../../infrastructure/database/user/user.repository.impl";
import { 
    UserFetchProfileDetails, 
    UserUpdateProfileImageResProps, 
    UserFetchProfileUseCaseRequestPayload, 
    UsrUpdateProfileImageUseCaseRequestPayload,
    UserUpdateUserInfoUseCaseRequestPayload,
    UserUpdateUserInfoUseCaseResponse, 
} from "../../infrastructure/dtos/user.dto";


export class UserFetchProfileDetailsUseCase {
    constructor(private userRepositoryImpl: UserRepositoryImpl) { }

    async execute(data: UserFetchProfileUseCaseRequestPayload): Promise<UserFetchProfileDetails> {
        const { userId } = data;
        if (!userId) throw new Error("Invalid request.");

        Validator.validateObjectId(userId, "userId");
        
        const user = await this.userRepositoryImpl.findUserById(userId);
        if (!user) throw new Error("User not found.");
        const { _id, password, profileImage, updatedAt, addressId, bookingsId, verificationToken, ...rest } = user;
        return { success: true, message: "User profile details fetched.", profileDetails: rest };
    }
}

export class UserUpdateProfileImageUseCase {
    constructor(
        private userRepositoryImpl: UserRepositoryImpl,
        private s3: S3Client,
    ) { }

    async execute(data: UsrUpdateProfileImageUseCaseRequestPayload): Promise<UserUpdateProfileImageResProps> {
        const { userId, file} = data;
        if (!userId || !file) throw new Error("Invalid request.");

        Validator.validateObjectId(userId, "userId");
        Validator.validateFile(file);

        const user = await this.userRepositoryImpl.findUserById(userId);
        if (!user) throw new Error("User not found.");
        try {
            const params = {
                Bucket: aws_s3Config.bucketName as string,
                Key: `userProfileImages/${userId}.${file.originalname.split('.').pop()}`,
                Body: file.buffer,
                ContentType: file.mimetype,
            };

            const upload = new Upload({
                client: this.s3,
                params: params,
            });

            const s3UploadResponse = await upload.done();
            if (!s3UploadResponse) throw new Error("Image uploading error, please try again");

            user.profileImage = s3UploadResponse.Location ?? "";
            const updatedUser = await this.userRepositoryImpl.updateUser(user);
            if (!updatedUser) throw new Error("Profile image returning failed.");

            const s3Key = await extractS3Key(updatedUser.profileImage);
            const signedUrl = await generateSignedUrl(s3Key);
            return { success: true, message: "Profile Image updated successfully.", profileImage: signedUrl };

        } catch {
            throw new Error("Unexpected error occured while updating profile image.");
        }
    }
}


export class UserUpdateProviderInfoUseCase {
    constructor(
        private userRepositoryImpl: UserRepositoryImpl 
    ) { }

    async execute(data: UserUpdateUserInfoUseCaseRequestPayload) : Promise<UserUpdateUserInfoUseCaseResponse> {
        const { userId, username, phone } = data;
        if(!userId || !username || !phone) throw new Error("Invalid request");

        Validator.validateObjectId(userId,"userId");
        validateOrThrow("username",username);
        validateOrThrow("phone",phone);

        const user = await this.userRepositoryImpl.findUserById(userId);
        if(!user) throw new Error("No user found");

        const userData = {
            ...user,
            username: username,
            phone: phone
        }

        const updatedUser = await this.userRepositoryImpl.updateUser(userData);
        if(!updatedUser) throw new Error("Info adding failed, please try again");

        const updatedData = { username: updatedUser.username, phone: updatedUser.phone };

        return { success: true, message: "Info updated successfully", userInfo: updatedData }
    }
}