# notes:

- object parsing is asynchronous

- when defining textures, either give it a texture or null. if texture is null it will default to the previously defined color.

- for obj parsing, shapes will use the texture provided until it is overwritten by an mtl usage instruction
    - this will only happen if overrideTexture is true

- textures must be converted to decimal new line RGB: [Useful conversion site](https://xeltalliv.github.io/ScratchTools/Img2list/#dn1)

- boxes don't get textures. they're not cool enough.

- currently reflectivity and brightness do not do anything. they're placeholder values for when diffuse lighting is implemented

- i don't know what license the 3dmm models and textures are under, use at your own risk

- the y axis is up/down. screw that euclid guy, i do what i want and what i want is an understandable y axis

- y axis is inverted for some things. this will be fixed at some point in the future.

- sometimes when uv mapping a triangle there it errors. the default color for errors is rgb 0,0,0.

- back face culling is broken af

- most of this is intended to be no-library for scratch implementation.

- this code is very unoptimized(ex: i'm 90% sure triangle uv mapping solves for collision. i don't know for sure because i didn't write that code, it's my friend's)

- all images refrenced by an mtl file must be in the same directory as the obj file and mtl file. they need to follow the naming scheme **imageName.fileExtension.txt**. Ex: 69702.TMAP.png.txt


- if something has more than 300 tris, it will probably run at < 1 fps on 8 resolution.

