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
   /* Creating the intensity vector */
	vec2 _intensity = texture2D(uIntensity, vec2(uTime, 0.5)).xy * uScale;

	/* Creating the deformation vector */
	vec2 _deformation = (texture2D(uDeformation, vTextureCoord + sin(uTime)).xy - 0.5) * _intensity;

	/* Computing the color */
    gl_FragColor = texture2D(uSampler, vTextureCoord + _deformation);
}
