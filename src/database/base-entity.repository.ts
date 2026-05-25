import { AggregateRoot } from '@nestjs/cqrs';
import { ObjectId } from 'mongodb';
import { QueryFilter } from 'mongoose';
import { EntityRepository } from './entity.repository';

import { IdentifiableEntitySchema } from './identifitable-entity.schema';

export abstract class BaseEntityRepository<
    TSchema extends IdentifiableEntitySchema,
    TEntity extends AggregateRoot
> extends EntityRepository<TSchema, TEntity> {
    async findOneById(id: string): Promise<TEntity> {
        return this.findOne({ _id: new ObjectId(id) } as QueryFilter<TSchema>);
    }

    async findOneAndReplaceById(id: string, entity: TEntity): Promise<void> {
        await this.findOneAndReplace(
            { _id: new ObjectId(id) } as QueryFilter<TSchema>,
            entity
        );
    }

    async findAll(): Promise<TEntity[]> {
        return this.find({});
    }
}
