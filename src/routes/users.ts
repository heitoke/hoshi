import { Router } from "express";

import application from "../libs/app";

const router: Router = Router();

router.get('/:userId', async (req, res) => {
    let { userId } = req.params;

    if (!userId) return res.status(401).json({ message: 'Not found this user', code: 401 });

    let user = await application.fetchUser(userId),
        metadata = await application.getUserMetaData(userId);
    
    res.status(200).json({ user, metadata });
});

router.get('/:userId/update', async (req, res) => {
    let { userId } = req.params;

    if (!userId) return res.status(401).json({});

    let user = await application.fetchUser(userId);

    application.setUserMetaData(user.id, user.username ,{ level: String((Math.random()*24).toFixed(0)), xp: String((Math.random()*523).toFixed(0)) })

    res.status(200).json({ message: 'This user updated', code: 200 });
});

export default router;