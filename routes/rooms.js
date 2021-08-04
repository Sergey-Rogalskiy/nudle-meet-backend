const router = require('express').Router()

const date = new Date(Date.now())

let rooms = [
    {
        'owner': 'Sergo',
        'participants': [
            {
                'name': "Sergo"
            },
            {
                'name': "Lenka"
            },
        ],
        'messages': [
            {
                'autor': 'Sergo',
                'text': 'Hello, Lenka',
                'date': date.toString()
            },
            {
                'autor': 'Lenka',
                'text': 'Hi, Sergo',
                'date': date.toString()
            }
        ]
    }
]

router.get('/',(req,res) => {
    res.send({'rooms': rooms})
})

router.post('/login',(req,res) => {
    const check = rooms.find(room => room.owner === req.query.name)
    if (check) {
        return res.send({result: null, reason:"User exists"})
    }
    else {
        const new_room = {
            'owner': req.query.name,
            'participants': [
                {
                    'name': req.query.name
                },
            ],
            'messages': [
            ]
        }
        rooms.push(new_room)
        res.send(new_room)
    }
})


router.get('/:owner',(req,res) => {
    const check = rooms.find(room => room.owner === req.params.owner)
    if (check) {
        return res.send(check)
    } else {
        res.send({result: null, reason:"Rooms does not exist"})
    }
})

module.exports = router