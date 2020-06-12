declare namespace Roll20 {
    interface Object {
        /** A unique ID for this object. Globally unique across all objects in this game. Read-only. */
        _id: unknown

        /**
         * Note: currently you can delete 'graphic', 'text', 'path',
         * 'character', 'ability', 'attribute', 'handout', 'rollabletable',
         * 'tableitem', and 'macro' objects.
         *
         * You can delete existing game objects using the `.remove()` function.
         * The `.remove()` function works on all of the objects you can create
         * with the createObj function. You call the function directly on the
         * object. For example, `mycharacter.remove();`.
         */
        remove(): void
    }

    interface Path extends Object {
        /** Can be used to identify the object type or search for the object. Read-only. */
        readonly _type: 'path'
        /** ID of the page the object is in. Read-only. */
        readonly _pageid: unknown
        /** A JSON string describing the lines in the path. Read-only, except when creating a new path. See Objects/Path for more information. */
        readonly _path: string
        /** Fill color. Use the string "transparent" or a hex color as a string, for example "#000000" */
        fill: string
        /** Stroke (border) color. */
        stroke: string
        /** Rotation (in degrees). */
        rotation: number
        /** ""	Current layer, one of "gmlayer", "objects", "map", or "walls". The walls layer is used for dynamic lighting, and paths on the walls layer will block light. */
        layer: "gmlayer" | "objects" | "map" | "walls"

        stroke_width: number
        width: string
        height: string

        /** Y-coordinate for the center of the path */
        top: string
        /** X-coordinate for the center of the path */
        left: string

        scaleX: string
        scaleY: string

        /** Comma-delimited list of player IDs who can control the path. Controlling players may delete the path. If the path was created by a player, that player is automatically included in the list. All Players is represented by having 'all' in the list. */
        controlledby: string
    }

    interface Character extends Object {
        /** Can be used to identify the object type or search for the object. Read-only. */
        readonly _type: 'character'
        /** URL to an image used for the character. See the note about avatar and imgsrc restrictions below. */
        avatar: string

        name: string
        /** The character's biography. See the note below about accessing the Notes, GMNotes, and bio fields. */
        bio: string
        /** Notes on the character only viewable by the GM. See the note below about accessing the Notes, GMNotes, and bio fields. */
        gmnotes: string

        archived: boolean
        /** Comma-delimited list of player ID who can view this character. Use "all" to give all players the ability to view. All Players is represented by having 'all' in the list. */
        inplayerjournals: string
        /** Comma-delimited list of player IDs who can control and edit this character. Use "all" to give all players the ability to edit. All Players is represented by having 'all' in the list. */
        controlledby: string
        /** A JSON string that contains the data for the Character's default token if one is set. Note that this is a "blob" similar to "bio" and "notes", so you must pass a callback function to get(). Read-only. */
        readonly _defaulttoken: string
    }

    interface TypeMap {
        "character": Character
    }

    interface EventMap {
        'add:character': Character
    }
}

declare function on<K extends keyof Roll20.EventMap>(event: K, callback: (event: Roll20.EventMap[K]) => void): void;

declare function getObj<K extends keyof Roll20.TypeMap>(type: keyof K)

/**
 * The Character Sheets feature affects the usage of the Attributes object type,
 * because the sheets have the capability of specifying a default value for each
 * attribute on the sheet. However, if the attribute is set to the default
 * value, there is not yet an actual Attribute object created in the game for
 * that Character. We provide a convenience function which hides this complexity
 * from you. You should use this function to get the value of an attribute going
 * forward, especially if you know that a game is using a Character Sheet.
 *
 * Simply specify the character's ID, the name (not ID) of the attribute (e.g.
 * "HP" or "Str"), and then if you want the "current" or "max" for value_type.
 * Here's an example:
 *
 * ```
 * var character = getObj("character", "-JMGkBaMgMWiQdNDwjjS");
 * getAttrByName(character.id, "str"); // the current value of str, for example "12"
 * getAttrByName(character.id, "str", "max"); //the max value of str, for example "[[floor(@{STR}/2-5)]]"
 * Note that fields which have auto-calculated values will return the formula rather than the result of the value. You can then pass that formula to sendChat() to use the dice engine to calculate the result for you automatically.
 * ```
 *
 * Be sure to also look at the Character Sheet documentation for more
 * information on how the Character Sheets interact with the API.
 *
 * getAttrByName will only get the value of the attribute, not the attribute
 * object itself. If you wish to reference properties of the attribute other
 * than "current" or "max", or if you wish to change properties of the
 * attribute, you must use one of the other functions above, such as findObjs.
 *
 * In the case that the requested attribute does not exist, `getAttrByName()`
 * will return undefined.
 *
 */
declare function getAttrByName(character_id: string, attribute_name: string, value_type: string): string | undefined

/**
 * You can create a new object in the game using the `createObj` function. You
 * must pass in the type of the object (one of the valid _type properties from
 * the objects list above), as well as an attributes object containing a list of
 * properties for the object. Note that if the object is has a parent object
 * (for example, attributes and abilities belong to characters, graphics, texts,
 * and paths belong to pages, etc.), you must pass in the ID of the parent in
 * the list of properties (for example, you must include the characterid
 * property when creating an attribute). Also note that even when creating new
 * objects, you can't set read-only properties, they will automatically be set
 * to their default value. The one exception to this is when creating a Path,
 * you must include the 'path' property, but it cannot be modified once the path
 * is initially created.
 * 
 * `createObj` will return the new object, so you can continue working with it.
 */
declare function createObj<K extends keyof Roll20.TypeMap>(type: K, attributes: Partial<Roll20.TypeMap[K]>): Roll20.TypeMap[K]