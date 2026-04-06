export type ResourceDomain = 'booking' | 'room';

interface TrackedResource {
  domain: ResourceDomain;
  id: number;
}

export class TestDataRegistry {
  private readonly resources: TrackedResource[] = [];

  track(domain: ResourceDomain, id: number): void {
    this.resources.push({ domain, id });
  }

  getAll(): TrackedResource[] {
    return [...this.resources];
  }

  clear(): void {
    this.resources.length = 0;
  }
}
