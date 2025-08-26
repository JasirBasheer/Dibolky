
import {
  IsString,
  IsArray,
  ValidateNested,
  IsInt,
} from "class-validator";
import { Type } from "class-transformer";
import { AddressType } from "@/types/agency";

export interface IAgencyRegistrationDto {
  organizationName: string;
  name: string;
  email: string;
  address: AddressType;
  websiteUrl: string;
  industry: string;
  contactNumber: string;
  logo: string;
  password: string;
  planId: string;
  validity: number;
  planPurchasedRate: number;
  transactionId: string;
  paymentGateway: string;
  description: string;
  currency: string;
}


export class TableResponseDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TableDto)
  data!: TableDto[];

  @IsInt()
  page!: number;

  @IsInt()
  totalPages!: number;
}


export class TableDto {
  @IsString()
  id!: string;

  @IsString()
  name!: string;

  @IsString()
  qr_code!: string;


}
