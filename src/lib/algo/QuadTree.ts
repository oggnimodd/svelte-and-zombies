// QuadTree.ts
interface Bounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface QuadTreeEntity {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

class QuadTree {
  private bounds: Bounds;
  private capacity: number;
  private entities: QuadTreeEntity[] = [];
  private divided: boolean = false;
  private northwest?: QuadTree;
  private northeast?: QuadTree;
  private southwest?: QuadTree;
  private southeast?: QuadTree;

  constructor(bounds: Bounds, capacity: number) {
    this.bounds = bounds;
    this.capacity = capacity;
  }

  insert(entity: QuadTreeEntity): boolean {
    if (!this.contains(this.bounds, entity)) return false;

    if (this.entities.length < this.capacity) {
      this.entities.push(entity);
      return true;
    }

    if (!this.divided) this.subdivide();

    return (
      this.northwest!.insert(entity) ||
      this.northeast!.insert(entity) ||
      this.southwest!.insert(entity) ||
      this.southeast!.insert(entity)
    );
  }

  query(range: Bounds, found: QuadTreeEntity[] = []): QuadTreeEntity[] {
    if (!this.intersects(this.bounds, range)) return found;

    for (const entity of this.entities) {
      if (this.contains(range, entity)) found.push(entity);
    }

    if (this.divided) {
      this.northwest!.query(range, found);
      this.northeast!.query(range, found);
      this.southwest!.query(range, found);
      this.southeast!.query(range, found);
    }

    return found;
  }

  clear() {
    this.entities = [];
    this.divided = false;
    this.northwest = undefined;
    this.northeast = undefined;
    this.southwest = undefined;
    this.southeast = undefined;
  }

  remove(entityId: string) {
    // Remove from current node
    this.entities = this.entities.filter((e) => e.id !== entityId);

    // Recursively remove from all subdivisions
    if (this.divided) {
      this.northwest?.remove(entityId);
      this.northeast?.remove(entityId);
      this.southwest?.remove(entityId);
      this.southeast?.remove(entityId);

      // Check if we can undivide after removal
      if (this.getTotalEntities() <= this.capacity) {
        // Collect remaining entities
        const remainingEntities = this.getAllEntities();
        // Clear subdivisions
        this.divided = false;
        this.northwest = undefined;
        this.northeast = undefined;
        this.southwest = undefined;
        this.southeast = undefined;
        // Restore remaining entities to this node
        this.entities = remainingEntities;
      }
    }
  }

  private subdivide() {
    const { x, y, width, height } = this.bounds;
    const halfW = width / 2;
    const halfH = height / 2;

    this.northwest = new QuadTree(
      { x, y, width: halfW, height: halfH },
      this.capacity
    );
    this.northeast = new QuadTree(
      { x: x + halfW, y, width: halfW, height: halfH },
      this.capacity
    );
    this.southwest = new QuadTree(
      { x, y: y + halfH, width: halfW, height: halfH },
      this.capacity
    );
    this.southeast = new QuadTree(
      { x: x + halfW, y: y + halfH, width: halfW, height: halfH },
      this.capacity
    );

    this.divided = true;
  }

  private contains(bounds: Bounds, entity: QuadTreeEntity): boolean {
    return (
      entity.x >= bounds.x &&
      entity.x < bounds.x + bounds.width &&
      entity.y >= bounds.y &&
      entity.y < bounds.y + bounds.height
    );
  }

  private intersects(a: Bounds, b: Bounds): boolean {
    return !(
      a.x + a.width <= b.x ||
      a.x >= b.x + b.width ||
      a.y + a.height <= b.y ||
      a.y >= b.y + b.height
    );
  }

  private getTotalEntities(): number {
    let total = this.entities.length;
    if (this.divided) {
      total += this.northwest!.getTotalEntities();
      total += this.northeast!.getTotalEntities();
      total += this.southwest!.getTotalEntities();
      total += this.southeast!.getTotalEntities();
    }
    return total;
  }

  private getAllEntities(): QuadTreeEntity[] {
    let allEntities = [...this.entities];
    if (this.divided) {
      allEntities = allEntities.concat(
        this.northwest!.getAllEntities(),
        this.northeast!.getAllEntities(),
        this.southwest!.getAllEntities(),
        this.southeast!.getAllEntities()
      );
    }
    return allEntities;
  }
}

export default QuadTree;
