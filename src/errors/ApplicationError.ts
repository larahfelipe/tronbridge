import type { FastifyError } from 'fastify';

export class ApplicationError implements FastifyError {
  readonly message: string;
  readonly statusCode: number;
  readonly name: string;
  readonly code: string;

  constructor(message: string, statusCode = 500, name = 'ApplicationError') {
    this.message = message;
    this.statusCode = statusCode;
    this.name = name;
    this.code = name;
  }
}
