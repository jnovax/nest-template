import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { PrometheusExporter } from './exporter-prometheus';
import { OpenTelemetryModule } from '@metinseylan/nestjs-opentelemetry';

@Module({
  imports: [OpenTelemetryModule.forRoot({
    instrumentations: [getNodeAutoInstrumentations()],
    spanProcessor: new SimpleSpanProcessor(
      new OTLPTraceExporter({
        url: 'http://localhost:4318/v1/traces',
      })
    ),
    metricReader: new PrometheusExporter({
      endpoint: 'metrics',
      port: 9464,
    }),
    serviceName: "Demo",
  }),],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }