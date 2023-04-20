import { Router } from "express";

import application, { levelUp } from "../libs/app";

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

router.get('/:userId/level/up', async (req, res) => {
    let { userId } = req.params;
    
    try {
        let user = await application.fetchUser(userId);

        if (!user) return res.status(404).json({ message: 'Not found this user', code: 404 });
        
        levelUp(user.id, user.username);

        res.status(200).json({ message: 'This user updated', code: 200 });   
    } catch (err) {
        console.log(err);
        res.status(501).json({ message: 'Server error', code: 501 });
    }
});

export default router;