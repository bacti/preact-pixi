import invariant from 'fbjs/lib/invariant'

export default class ElementFactory
{
    static Instance(node, container, component, top)
    {
        let attributes = node.attributes || {}
        let { object, ref } = attributes
        let instance = undefined
        let customed = false
        switch (node.nodeName.name)
        {
            case 'Container':
            {
                instance = new PIXI.Container()
                break
            }
            case 'ParticleContainer':
            {
                const { maxSize, properties, batchSize, autoResize } = attributes
                instance = new PIXI.particles.ParticleContainer(maxSize, properties, batchSize, autoResize)
                break
            }
            case 'Text':
            {
                instance = new PIXI.Text(attributes.text, attributes.style)
                break
            }
            case 'BitmapText':
            {
                instance = new PIXI.extras.BitmapText(attributes.text, attributes.style)
                break
            }
            case 'Sprite':
            {
                const { texture, frame, blendMode, pluginName, tint } = attributes
                texture && (instance = new PIXI.Sprite(texture))
                frame && (instance = PIXI.Sprite.fromFrame(frame))
                blendMode && (instance.blendMode = blendMode)
                pluginName && (instance.pluginName = pluginName)
                tint && (instance.tint = tint)
                break
            }
            case 'AnimatedSprite':
            {
                const { textures, animationSpeed, gotoAndPlay, play } = attributes
                instance = new PIXI.extras.AnimatedSprite(textures)
                animationSpeed && (instance.animationSpeed = animationSpeed)
                gotoAndPlay && instance.gotoAndPlay(gotoAndPlay)
                play && instance.play()
                break
            }
            case 'TilingSprite':
            {
                instance = new PIXI.extras.TilingSprite(attributes.texture, attributes.width, attributes.height)
                break
            }
            case 'Rope':
            {
                const { texture, points, blendMode } = attributes
                instance = new PIXI.mesh.Rope(texture, points)
                blendMode && (instance.blendMode = blendMode)
                break
            }
            default:
            {
                let { root } = top.props
                let inst = new node.nodeName()
                inst.props = inst.props || attributes
                inst.props.parent = container
                inst.props.root = root
                inst.componentRender(node, top)
                container.addChild(inst.container)
                object && (top.objects[object] = inst.container)
                ref && (top.refs[ref] = inst)
                customed = true
                break
            }
        }

        if (!customed)
        {
            instance.props = attributes
            container.addChild(instance)
            top.SetupContainer(instance, node)
            object && (top.objects[object] = instance)
        }
        // invariant(instance, 'Preact-Pixi does not support the type: `%s` currently.', type)
    }
}
