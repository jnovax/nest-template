import { Request } from 'express';

interface FileMapper {
    file: Express.Multer.File;
}

interface FilesMapper {
    files: Express.Multer.File[];
}

export const fileMapper = ({ file }: FileMapper) => {
    return {
        originalname: file.originalname,
        filename: file.filename,
        image_url: `${file.path}`,
    };
};

export const filesMapper = ({ files }: FilesMapper) => {
    return files.map((file) => {
        return {
            originalname: file.originalname,
            filename: file.filename,
            image_url: `${file.path}`,
        };
    });
};