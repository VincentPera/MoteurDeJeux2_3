precision mediump float;

/* Rendu du jeu */
uniform sampler2D uSampler;

/* Texture de déformation en rouge et vert */
uniform sampler2D uDeformation;

/* Texture pour contrôler l'intensité de la déformation */
uniform sampler2D uIntensity;

/* Interval de temps multiplié par la vitesse depuis l'activation du composant */
uniform float uTime;

/* Échelle de la déformation */
uniform float uScale;

/* Coordonnées UV du fragment */
varying vec2 vTextureCoord;

void main(void) {
   /* Calculer l’intensité de la déformation à appliquer selon le temps, par la recherche d’une valeur dans la texture uIntensity, aux coordonnées (uTime, 0.5). Mettre cette intensité à l’échelle uScale.*/
	vec2 intensity = texture2D(uIntensity, vec2(uTime, 0.5)).xy * uScale;

	/*Chercher un vecteur de déformation dans la texture uDeformation, aux coordonnées vTextureCoord décalé d’une valeur tirée de uTime (par exemple, le sinus de uTime). Moduler ce vecteur de déformation par l’intensité précédente. */
	vec2 deformation = (texture2D(uDeformation, vTextureCoord + sin(uTime)).xy - 0.5) * intensity;

	/* Chercher la couleur finale dans uSampler aux coordonnées vTextureCoord, décalées du vecteur de déformation. */
    gl_FragColor = texture2D(uSampler, vTextureCoord + deformation);
}
