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

    var count = 0;
    
    /*while (count <= layerSprites.length) {
    for (var i = 0; i < layerSprites.length; i++) {
            layerSprites[i].spriteSheet.bind();
            GL.bindBuffer(GL.ARRAY_BUFFER, layerSprites[i].vertexBuffer);
            GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, layerSprites[i].indexBuffer);
            
        }
        
    GL.drawElements(GL.TRIANGLES, 6, GL.UNSIGNED_SHORT, 0);
    for (var i = 0; i < layerSprites.length; i++) {
        layerSprites[i].spriteSheet.unbind();
       
    }*/
        
       // count++;
   // }
    
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
