import { Router } from "express";

import application from "../libs/app";

const router: Router = Router();

router.get('/:userId', async (req, res) => {
    let { userId } = req.params;

    try {
        let user = await application.fetchUser(userId);

        if (!user) return res.status(404).json({ message: 'Not found this user', code: 404 });

        let metadata = await application.getUserMetaData(userId);
    
        res.status(200).json({ user, metadata });
    } catch (err) {
        console.log(err);
        res.status(501).json({ message: 'Server error', code: 501 });
    }
});

interface IMetaData {
    platform_name: string;
    platform_username: string | null;
    metadata: {
        level: string;
        xp: string;
    }
}

router.get('/:userId/level/up', async (req, res) => {
    let { userId } = req.params;
    
    try {
        let user = await application.fetchUser(userId);

        if (!user) return res.status(404).json({ message: 'Not found this user', code: 404 });
        
        let metadata = (await application.getUserMetaData(userId) as IMetaData).metadata,
            xp = Number(metadata.xp),
            level = Number(metadata.level),
            plusXp = Number((Math.random() * Date.now()).toFixed(3).split('.')[1]),
            isXp = (xp + plusXp) >= ((level + 1) * (((level + 1) * 12) * 24));
        
        application.setUserMetaData(user.id, user.username, {
            level: String(level + (isXp ? 1 : 0)),
            xp: String(isXp ? 0 : xp + plusXp)
        });

        res.status(200).json({ message: 'This user updated', code: 200 });   
    } catch (err) {
        console.log(err);
        res.status(501).json({ message: 'Server error', code: 501 });
    }
});

export default router;