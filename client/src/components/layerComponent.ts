import { Component } from './component';
import { SpriteComponent } from './spriteComponent';
import { IDisplayComponent } from '../displaySystem';
import * as GraphicsAPI from '../graphicsAPI';
import { IEntity, Entity } from './entity';

let GL: WebGLRenderingContext;


// # Classe *LayerComponent*
// Ce composant représente un ensemble de sprites qui
// doivent normalement être considérées comme étant sur un
// même plan.
export class LayerComponent extends Component<Object> implements IDisplayComponent {

	private vertexBuffer: WebGLBuffer;
	private indexBuffer: WebGLBuffer;
	private vertexSize: number;


	setup() {
		GL = GraphicsAPI.context;
		this.vertexSize = 5;
		// Build the buffers
		this.vertexBuffer = GL.createBuffer()!;
		this.indexBuffer = GL.createBuffer()!;

		const MAX_SPRITES = 99;

		var vertices = new Float32Array(4 * 5 * MAX_SPRITES);
		var ind = [];

		for (var i = 0; i < MAX_SPRITES; i++) {
			var k = i * 4;
			ind.push(k, k + 1, k + 2, k + 2, k + 3, k);
		}
		var indices = new Uint16Array(ind);

		// Bind all the buffers and set the contextual datas
		GL.bindBuffer(GL.ARRAY_BUFFER, this.vertexBuffer);
		GL.bufferData(GL.ARRAY_BUFFER, vertices, GL.DYNAMIC_DRAW);
		GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
		GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, indices, GL.DYNAMIC_DRAW);

	}


  // ## Méthode *display*
  // La méthode *display* est appelée une fois par itération
  // de la boucle de jeu.
	display(dT: number) {
		//Gather all the sprite of the same layer in an array
		const layerSprites = this.listSprites();
		if (layerSprites.length === 0) {
			return;
		}
		GL = GraphicsAPI.context;
		const spriteSheet = layerSprites[0].spriteSheet;


		if (spriteSheet) {
			
			//create one big sprite from all the sprite of the same layer
			var vertices = new Float32Array(4 * this.vertexSize * layerSprites.length);
			var ind = [];
			for (var i = 0; i < layerSprites.length; i++) {
				var sprite = layerSprites[i];
				if (sprite.vertices) {
					var k = i * 4;
					vertices.set(sprite.vertices, k * this.vertexSize);
					ind.push(k, k + 1, k + 2, k + 2, k + 3, k);
				}
			}
			var indices = new Uint16Array(ind);



			// Bind all the buffers and set the contextual datas
			GL.bindBuffer(GL.ARRAY_BUFFER, this.vertexBuffer);
			GL.bufferSubData(GL.ARRAY_BUFFER, 0, vertices);
			GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
			GL.bufferSubData(GL.ELEMENT_ARRAY_BUFFER, 0, indices);

			// Draw all the sprites in the scene
			spriteSheet.bind();
			GL.drawElements(GL.TRIANGLES, 6 * i, GL.UNSIGNED_SHORT, 0);
			spriteSheet.unbind();
		}


    
  }

  // ## Fonction *listSprites*
  // Cette fonction retourne une liste comportant l'ensemble
  // des sprites de l'objet courant et de ses enfants.
  /*private listSprites() {
    const sprites: SpriteComponent[] = [];
    this.owner.walkChildren((child) => {
      if (!child.active)
        return;

      child.walkComponent((comp) => {
        if (comp instanceof SpriteComponent && comp.enabled)
          sprites.push(comp);
      });
    });

    return sprites;
	}
	*/

  // ## Fonction *listSprites*
  // Cette fonction retourne une liste comportant l'ensemble
  // des sprites de l'objet courant et de ses enfants.
  listSprites() {
	  var sprites: SpriteComponent[] = [];
	  sprites =  this.listSpritesRecursive(this.owner, sprites);
	  return sprites;
  }

  // ## Fonction *listSpritesRecursive*
  //Développé dans le but de récupérer le HUD qui était indisponible dans la première version du code
  listSpritesRecursive(obj: IEntity, sprites: SpriteComponent[]): SpriteComponent[]  {
	  if (!obj.active) {
		  return sprites;
	  }
	  obj.walkChildren((child) => {
		  if (!child.active)
			  return sprites;
		  sprites = this.listSpritesRecursive(child, sprites);

	  });

	  obj.walkComponent((comp) => {

		  if (comp instanceof SpriteComponent && comp.enabled) {
			  sprites.push(comp);
		  }

	  });
	 
	  return sprites;
  }



}
