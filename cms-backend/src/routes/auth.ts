import { Router } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { requireAuth, signToken, type AuthenticatedRequest } from "../middleware/auth";

const router = Router();

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(4),
});

router.post("/login", async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid email or password format" });
    return;
  }

  const user = await prisma.user.findUnique({
    where: { email: parsed.data.email.toLowerCase().trim() },
  });

  if (!user) {
    res.status(401).json({ error: "Invalid email or password" });
    return;
  }

  const valid = await bcrypt.compare(parsed.data.password, user.passwordHash);
  if (!valid) {
    res.status(401).json({ error: "Invalid email or password" });
    return;
  }

  const payload = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role as "SUPER_ADMIN" | "EDITOR" | "REVIEWER",
  };

  const token = signToken(payload);
  res.json({ token, user: payload });
});

router.get("/me", requireAuth, async (req: AuthenticatedRequest, res) => {
  res.json({ user: req.user });
});

export default router;
