import { NotFoundException } from '@nestjs/common';
import { AggregateRoot } from '@nestjs/cqrs';
import { Model, QueryFilter } from 'mongoose';

import { EntitySchemaFactory } from './entity-schema.factory';
import { IdentifiableEntitySchema } from './identifitable-entity.schema';

export abstract class EntityRepository<
    TSchema extends IdentifiableEntitySchema,
    TEntity extends AggregateRoot
> {
    constructor(
        protected readonly entityModel: Model<TSchema>,
        protected readonly entitySchemaFactory: EntitySchemaFactory<
            TSchema,
            TEntity
        >
    ) {}

    protected async findOne(
        entityFilterQuery?: QueryFilter<TSchema>
    ): Promise<TEntity> {
        const entityDocument = await this.entityModel.findOne(
            entityFilterQuery,
            {},
            { lean: true }
        );

        if (!entityDocument) {
            throw new NotFoundException('Entity was not found.');
        }

        return this.entitySchemaFactory.createFromSchema(
            entityDocument as TSchema
        );
    }

    protected async find(
        entityFilterQuery?: QueryFilter<TSchema>
    ): Promise<TEntity[]> {
        return (
            await this.entityModel.find(entityFilterQuery, {}, { lean: true })
        ).map(entityDocument =>
            this.entitySchemaFactory.createFromSchema(entityDocument as TSchema)
        );
    }

    async create(entity: TEntity): Promise<void> {
        await new this.entityModel(
            this.entitySchemaFactory.create(entity)
        ).save();
    }

    protected async findOneAndReplace(
        entityFilterQuery: QueryFilter<TSchema>,
        entity: TEntity
    ): Promise<void> {
        const updatedEntityDocument = await this.entityModel.findOneAndReplace(
            entityFilterQuery,
            this.entitySchemaFactory.create(entity),
            {
                new: true,
                lean: true
            }
        );

        if (!updatedEntityDocument) {
            throw new NotFoundException(
                'Unable to find the entity to replace.'
            );
        }
    }
}
