import { Component, IComponent } from './component';
import { PositionComponent } from './positionComponent';
import { RupeeComponent } from './rupeeComponent';
import { HeartComponent } from './heartComponent';
import { ChickenComponent } from './chickenComponent';
import { ILogicComponent } from '../logicSystem';
import { Rectangle } from './rectangle';
import { Quadtree } from './quadtree';

export interface ICollisionComponent extends IComponent {
  onCollision(other: ColliderComponent): void;
}

// ## Variable *colliders*
// On conserve ici une référence vers toutes les instances
// de cette classe, afin de déterminer si il y a collision.
const colliders: ColliderComponent[] = [];



// # Classe *ColliderComponent*
// Ce composant est attaché aux objets pouvant entrer en
// collision.
interface ISize {
  w: number;
  h: number;
}

interface IColliderComponentDesc {
  flag: number;
  mask: number;
  size: ISize;
  handler?: string;
}

export class ColliderComponent extends Component<IColliderComponentDesc> implements ILogicComponent {
  private flag: number;
  private mask: number;
  private size: ISize;
  private handler?: ICollisionComponent;
  private active = true;

  // ## Méthode *create*
  // Cette méthode est appelée pour configurer le composant avant
  // que tous les composants d'un objet aient été créés.
  create(descr: IColliderComponentDesc) {
	  this.flag = descr.flag;
	  this.mask = descr.mask;
	  this.size = descr.size;
  }

  // ## Méthode *setup*
  // Si un type *handler* est défini, on y appellera une méthode
  // *onCollision* si une collision est détectée sur cet objet.
  // On stocke également une référence à l'instance courante dans
  // le tableau statique *colliders*.
  setup(descr: IColliderComponentDesc) {
      if (descr.handler) {
        this.handler = this.owner.getComponent<ICollisionComponent>(descr.handler);
      }
    colliders.push(this);
  }

  // ## Méthode *update*
  // À chaque itération, on vérifie si l'aire courante est en
  // intersection avec l'aire de chacune des autres instances.
  // Si c'est le cas, et qu'un type *handler* a été défini, on
  // appelle sa méthode *onCollision* avec l'objet qui est en
  // collision.
  update() {
    if (!this.handler) {
      return;
    }

	// Clear the quadtree
    const quadtree = new Quadtree(0, new Rectangle({
        x: 0,
        y: 0,
        width: 770,  // The screen width
        height: 578, // The screen height
    }));

    const area = this.area;

	  // Build the quadtree
	  colliders.forEach((c) => {
		  // Trivial cases
		  if (c === this || !c.enabled || !c.owner.active) {
			  return;
		  }

		  // Ignore the collider if its flag is not in the current mask
		  if (!(c.flag & this.mask)) {
			  return;
		  }
          //Insert the object in the quadtree
          quadtree.insert(c);
	  });


	  // Iterate through the pertinent colliders using the content of the quadtree
		//Know issue : all collisions are at least doubled for an unknown reason.
		//To desactivate the quadtree use comment the aprt below and uncomment the part directly following
	  var pertinentColliders = quadtree.retrieve(area);
      pertinentColliders.forEach((c) => {
        /*  console.log(this.owner);
          console.log(c.owner);*/
          // Bounding box test
          if (area.intersectsWith(c.area) && c.active) {

			  this.handler!.onCollision(c);
		  }
	  });

      /*if (area.intersectsWith(c.area)) {
        this.handler!.onCollision(c);
      }*/
  }

  // ## Propriété *area*
  // Cette fonction calcule l'aire courante de la zone de
  // collision, après avoir tenu compte des transformations
  // effectuées sur les objets parent.
  get area() {
    const position = this.owner.getComponent<PositionComponent>('Position').worldPosition;
    return new Rectangle({
      x: position[0],
      y: position[1],
      width: this.size.w,
      height: this.size.h,
    });
  }
}
