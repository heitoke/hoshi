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

router.get('/:userId/level/up', async (req, res) => {
    let { userId } = req.params;

    if (!userId) return res.status(401).json({ message: 'Not found this user', code: 401 });

    let user = await application.fetchUser(userId),
        metadata = await application.getUserMetaData(userId) as any,
        xp = Number((Math.random() * Date.now()).toFixed(3).split('.')[1]),
        isXp = (Number(metadata.xp) + xp) >= ((Number(metadata.level) + 1) * (((Number(metadata.level) + 1) * 12) * 24));

    application.setUserMetaData(user.id, user.username ,{
        level: String(Number(metadata.level + (isXp ? 1 : 0))),
        xp: String(isXp ? 0 : Number(metadata.xp) + xp)
    });

    res.status(200).json({ message: 'This user updated', code: 200 });
});

export default router;