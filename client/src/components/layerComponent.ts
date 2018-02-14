import { Component } from './component';
import { SpriteComponent } from './spriteComponent';
import { IDisplayComponent } from '../displaySystem';
import * as GraphicsAPI from '../graphicsAPI';

let GL: WebGLRenderingContext;


// # Classe *LayerComponent*
// Ce composant représente un ensemble de sprites qui
// doivent normalement être considérées comme étant sur un
// même plan.
export class LayerComponent extends Component<Object> implements IDisplayComponent {

	public vertexBuffer: WebGLBuffer;
	public indexBuffer: WebGLBuffer;



	// ## Méthode *setup*
	setup() {
		GL = GraphicsAPI.context;

		// Build the buffers
		this.vertexBuffer = GL.createBuffer()!;
		this.indexBuffer = GL.createBuffer()!;

		// Initialize the data stores
		const MAX_SPRITES = 1000;
		var vertices = new Float32Array(4 * 5 * MAX_SPRITES);
		var ind = [];
		for (var i = 0; i < MAX_SPRITES; i++) {
			var k = i * 4;
			ind.push(k, k + 1, k + 2, k + 2, k + 3, k);
		}
		var indices = new Uint16Array(ind);

		// Set the context
		GL.bindBuffer(GL.ARRAY_BUFFER, this.vertexBuffer);
		GL.bufferData(GL.ARRAY_BUFFER, vertices, GL.DYNAMIC_DRAW);
		GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
		GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, indices, GL.DYNAMIC_DRAW);

	}


  // ## Méthode *display*
  // La méthode *display* est appelée une fois par itération
  // de la boucle de jeu.
	display(dT: number) {
		const layerSprites = this.listSprites();
		if (layerSprites.length === 0) {
			return;
		}
		GL = GraphicsAPI.context;
		const spriteSheet = layerSprites[0].spriteSheet;

	
		/*if (layerSprites.length >=0){
			for (var i = 0; i < layerSprites.length; i++) {
				
				GL.bindBuffer(GL.ARRAY_BUFFER, layerSprites[i].vertexBuffer);
				GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, layerSprites[i].indexBuffer);
				layerSprites[i].spriteSheet.bind();
				GL.drawElements(GL.TRIANGLES, 6, GL.UNSIGNED_SHORT, 0);
				layerSprites[i].spriteSheet.unbind();
			}
		}*/
		

    /*for (var i = 0; i < layerSprites.length; i++) {
            
            GL.bindBuffer(GL.ARRAY_BUFFER, layerSprites[i].vertexBuffer);
			//GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, layerSprites[i].indexBuffer);
			layerSprites[i].spriteSheet.bind();
			
     }
	  GL.drawArrays(GL.TRIANGLES, 0, 1);   
    
    for (var i = 0; i < layerSprites.length; i++) {
        layerSprites[i].spriteSheet.unbind();
       
    }*/

		if (spriteSheet) {
			// Build the data stores
			var vertexSize = 5;
			var vertices = new Float32Array(4 * vertexSize * layerSprites.length);
			var ind = [];
			for (var i = 0; i < layerSprites.length; i++) {
				var sprite = layerSprites[i];
				if (sprite.vertices) {
					var k = i * 4;
					vertices.set(sprite.vertices, k * vertexSize);
					ind.push(k, k + 1, k + 2, k + 2, k + 3, k);
				}
			}
			var indices = new Uint16Array(ind);



			// Set the context
			GL.bindBuffer(GL.ARRAY_BUFFER, this.vertexBuffer);
			GL.bufferSubData(GL.ARRAY_BUFFER, 0, vertices);
			GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
			GL.bufferSubData(GL.ELEMENT_ARRAY_BUFFER, 0, indices);

			// Draw
			spriteSheet.bind();
			GL.drawElements(GL.TRIANGLES, 6 * i, GL.UNSIGNED_SHORT, 0);
			spriteSheet.unbind();
		}


    
  }

  // ## Fonction *listSprites*
  // Cette fonction retourne une liste comportant l'ensemble
  // des sprites de l'objet courant et de ses enfants.
  private listSprites() {
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
}
