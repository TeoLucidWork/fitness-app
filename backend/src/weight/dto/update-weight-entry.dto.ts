import { PartialType } from '@nestjs/mapped-types';
import { CreateWeightEntryDto } from './create-weight-entry.dto';

export class UpdateWeightEntryDto extends PartialType(CreateWeightEntryDto) {}