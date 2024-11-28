import { Injectable } from '@nestjs/common';
import * as sendgrid from '@sendgrid/mail';
import { groupBy, uniq } from 'lodash';
import { CartItemEntity } from '../cart/cartItem.entity';
import { ClientService } from '../client/domain/client.service';
import { ContractorCompaniesService } from '../contractorCompanies/domain/contractorCompanies.service';
export interface ConfirmationEmailDto {
  clientId: number;
  orderCode: number;
  orderItems: CartItemEntity[];
}

interface Item {
  quantity: number;
  name: string;
}

interface Order {
  marketName: string;
  marketHours: string;
  marketAddress: string;
  items: Item[];
}

export interface ConfirmationEmailSendgridDto {
  orders: Order[];
  code: number;
}

export interface SendEmailParam {
  to: string | string[];
  subject?: string;
  templateId: string;
  dynamicTemplateData: any;
}

@Injectable()
export class EmailService {
  constructor(
    private clientService: ClientService,
    private contractorService: ContractorCompaniesService,
  ) {
    sendgrid.setApiKey(process.env.SENDGRID_API_KEY);
  }

  async sendConfirmationEmailToCustomer({
    clientId,
    orderCode,
    orderItems,
  }: ConfirmationEmailDto) {
    const client = await this.clientService.findOne(clientId);
    const marketIds = uniq(orderItems.map((i) => i.product.company.id));
    const markets = await this.contractorService.findByIdList(marketIds);
    const grouped = groupBy(orderItems, (o) => o.product.company.id);
    const orders = Object.entries(grouped).map(([companyId, orderItems]) => {
      const market = markets.find((m) => m.id === Number(companyId));
      const items: Item[] = orderItems.map((i) => ({
        quantity: i.quantity,
        name: i.product.name,
      }));
      return {
        items,
        marketAddress: market.address.formattedName,
        marketHours: market.workingHours,
        marketName: market.name,
      };
    });

    this.send({
      to: client.email,
      templateId: 'd-ab5d9afef7ca43f48c6a6311ed0e233b',
      dynamicTemplateData: { orders, code: orderCode },
    });
  }

  async sendConfirmationEmailToContractors({
    orderCode,
    orderItems,
  }: Omit<ConfirmationEmailDto, 'clientId'>) {
    const marketIds = uniq(orderItems.map((i) => i.product.company.id));
    const markets = await this.contractorService.findByIdList(marketIds);
    const grouped = groupBy(orderItems, (o) => o.product.company.id);
    const promises = [];
    markets.forEach((m) => {
      const items = grouped[m.id].map((i) => ({
        quantity: i.quantity,
        name: i.product.name,
      }));
      promises.push(
        this.send({
          to: m.email,
          templateId: 'd-ce7211c001f44312ba53f9551dc26900',
          dynamicTemplateData: { items, code: orderCode },
        }),
      );
    });

    await Promise.all(promises);
  }

  private async send(param: SendEmailParam): Promise<void> {
    const { to, subject, templateId, dynamicTemplateData } = param;
    try {
      await sendgrid.send({
        to,
        from: process.env.SENDGRID_SENDER,
        subject,
        templateId,
        dynamicTemplateData,
      });
      console.log('Email sent successfully to ', to);
    } catch (err) {
      console.error(
        `Erro ao enviar e-mail, parâmetro: ${JSON.stringify(param)} : `,
        err,
      );
    }
  }
}
