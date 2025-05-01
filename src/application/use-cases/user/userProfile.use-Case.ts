import { Types } from "mongoose";
import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { aws_s3Config } from "../../../config/env";
import { generateSignedUrl } from "../../../config/aws_s3";
import { extractS3Key } from "../../../infrastructure/helpers/helper";
import { UserRepositoryImpl } from "../../../infrastructure/database/user/user.repository.impl";
import { UserFetchProfileDetails, UserUpdateProfileImageResProps } from "../../../shared/interface/userInterface";


export class UserFetchProfileDetailsUseCase {
    constructor(private userRepository: UserRepositoryImpl) { }

    async execute(userId: string): Promise<UserFetchProfileDetails> {
        if (!userId) throw new Error("Invalid request.");
        const user = await this.userRepository.findUserById(new Types.ObjectId(userId));
        if (!user) throw new Error("User not found.");
        const { _id, password, profileImage, updatedAt, addressId, bookingsId, verificationToken, ...data } = user;
        return { success: true, message: "User profile details fetched.", profileDetails: data };
    }
}

export class UserUpdateProfileImageUseCase {
    constructor(
        private userRepository: UserRepositoryImpl,
        private s3: S3Client,
    ) { }

    async execute(userId: string, file: Express.Multer.File): Promise<UserUpdateProfileImageResProps> {
        if (!userId || !file) throw new Error("Invalid request.");
        const user = await this.userRepository.findUserById(new Types.ObjectId(userId));
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
            const updatedUser = await this.userRepository.updateUser(user);
            if (!updatedUser) throw new Error("Profile image returning failed.");

            const s3Key = await extractS3Key(updatedUser.profileImage);
            const signedUrl = await generateSignedUrl(s3Key);
            return { success: true, message: "Profile Image updated successfully.", profileImage: signedUrl };

        } catch {
            throw new Error("Unexpected error occured while updating profile image.");
        }
    }
}