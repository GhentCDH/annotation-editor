import { AnnotationDefinition } from '../annotation-defintion.type';
import { ContextBuilder } from '@ghentcdh/w3c-utils';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ANNOTATION_DEF_CONFIG_TOKEN, AnnotationDefConfig } from '../utils/annotation.context-builder';


@Injectable()
export abstract class AnnotationDefinitionService {
  private definitions: AnnotationDefinition[] = [];
  private groupedDefinitions: Record<string, AnnotationDefinition> = {};
  private cachedAt = 0;

  constructor(@Inject(ANNOTATION_DEF_CONFIG_TOKEN)protected readonly config: AnnotationDefConfig){}

  async findAllGrouped(): Promise<Record<string, AnnotationDefinition>> {
    await this.setDefinitions();
    return Promise.resolve(this.groupedDefinitions);
  }

  protected abstract reloadDefinitions(): Promise<AnnotationDefinition[]>;

  async setDefinitions(force = false): Promise<void> {
    const now = Date.now();
    if (!force && this.definitions.length && now - this.cachedAt < this.config.cacheTTLms)
      return;

    const definitions = await this.reloadDefinitions();
    this.definitions = definitions;
    this.groupedDefinitions = definitions.reduce(
      (acc: Record<string, any>, current) => {
        acc[current.id] = current;
        return acc;
      },
      {},
    );
    this.cachedAt = now;
  }

  async findAll(): Promise<AnnotationDefinition[]> {
    await this.setDefinitions();
    return Promise.resolve(this.definitions);
  }

  async findById(id: string): Promise<AnnotationDefinition> {
    await this.setDefinitions();

    let find = this.groupedDefinitions[id];

    // If not found force to load it again, maybe it was added after the first load
    if (!find) await this.setDefinitions(true);
    find = this.groupedDefinitions[id];

    if (!find) throw new NotFoundException();

    return Promise.resolve(find);
  }

  async getAllContextBuilders() {
    return (await this.findAll()).map((a) => a.context as ContextBuilder);
  }

  async getContextBuilder(type: string): Promise<ContextBuilder> {
    const def = await this.findById(type);

    if (!def) throw new NotFoundException();

    return def.context as ContextBuilder;
    // return createContextBuilder(def);
  }
}
