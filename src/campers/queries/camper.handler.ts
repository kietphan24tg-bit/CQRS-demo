import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { CamperDto } from '../Camper.dto';
import { CamperDtoRepository } from '../db/camper-dto.repository';
import { CampersQuery } from './camper.query';

@QueryHandler(CampersQuery)
export class CampersHandler implements IQueryHandler<CampersQuery> {
    constructor(private readonly camperDtoRepository: CamperDtoRepository) {}

    async execute(): Promise<CamperDto[]> {
        return this.camperDtoRepository.findAll();
    }
}
