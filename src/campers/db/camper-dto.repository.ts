import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCamperRequest } from '../dto/request/create-camper-request.dto'
import { CamperSchema } from './camper.schema';

@Injectable()
export class CamperDtoRepository {
    constructor(
        @InjectModel(CamperSchema.name)
        private readonly camperModel: Model<CamperSchema>
    ) {}

    async findAll(): Promise<CreateCamperRequest[]> {
        const campers = await this.camperModel.find({}, {}, { lean: true });
        return campers.map(camper => {
            const allergiesLower = camper.allergies.map(allergy =>
                allergy.toLocaleLowerCase()
            );
            const isAllergicToPeanuts = allergiesLower.includes('peanuts');
            return {
                ...camper,
                isAllergicToPeanuts
            };
        });
    }
}
