/**
 * Created by Pablo Henrick Diniz on 01/10/14.
 */

define(function(){
    return {
        combinations:{
            Steel: {
                Steel: 0.12,
                Aluminum: 0.14,
                CastIron: 0.16,
                Bronze: 0.16,
                Ice: 0.014,
                Babbitt: 0.22,
                Stone: 0.5
            },
            Aluminum: {
                Aluminum: 1.05
            },
            Rubber: {
                Wood: 0.6,
                Metal: 0.6
            },
            Bronze: {
                Bronze: 0.2,
                Iron: 0.16,
                CastIron: 0.21
            },
            HempHope: {
                Steel: 0.25,
                Wood: 0.50
            },
            Leather: {
                CastIron: 0.28,
                Wood: 0.30
            },
            Fiber: {
                CastIron: 0.4
            },
            CastIron: {
                CastIron: 0.22,
                HardWood: 0.32
            },
            Wood: {
                Ice: 0.03
            },
            HardWood: {
                HardWood: 0.25
            },
            Brick: {
                Wood: 0.6
            },
            Metal: {
                HardWood: 0.40
            },
            Stone: {
                Wood: 0.40,
                Brick: 0.60
            },
            Tire: {
                Road: 0.6,
                Grass: 0.35
            },
            Wheel: {
                Rail: 0.16
            },
            Ice: {
                Ice: 0.02
            }
        }
    }
});
