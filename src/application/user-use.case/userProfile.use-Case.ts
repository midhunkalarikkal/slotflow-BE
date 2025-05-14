import { Types } from "mongoose";
import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { aws_s3Config } from "../../config/env";
import { generateSignedUrl } from "../../config/aws_s3";
import { extractS3Key } from "../../infrastructure/helpers/helper";
import { UserRepositoryImpl } from "../../infrastructure/database/user/user.repository.impl";
import { UserFetchProfileDetails, UserFetchProfileUseCaseRequestPayload, UserUpdateProfileImageResProps, UsrUpdateProfileImageUseCaseRequestPayload } from "../../infrastructure/dtos/user.dto";


export class UserFetchProfileDetailsUseCase {
    constructor(private userRepositoryImpl: UserRepositoryImpl) { }

    async execute(data: UserFetchProfileUseCaseRequestPayload): Promise<UserFetchProfileDetails> {
        const { userId } = data;
        if (!userId) throw new Error("Invalid request.");
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