import { prisma } from "../lib/prisma";
import type { StudentSession, SessionStatus } from "@/lib/types";

export async function listStudentSessions(userId: string): Promise<StudentSession[]> {
  const enrollments = await prisma.enrollment.findMany({
    where: { userId },
    include: {
      session: {
        include: {
          tutor: { select: { name: true } },
          enrollments: { select: { status: true } },
        },
      },
    },
    orderBy: { session: { startAt: "asc" } },
  });

  return enrollments.map((e) => {
    const s = e.session;
    return {
      id: s.id,
      code: s.code,
      title: s.title,
      subject: s.subject,
      gradeLevel: s.gradeLevel as StudentSession["gradeLevel"],
      world: s.world,
      startAt: s.startAt.toISOString(),
      durationMin: s.durationMin,
      capacity: s.capacity,
      enrolled: s.enrollments.length,
      paid: s.enrollments.filter((en) => en.status === "PAID").length,
      status: s.status as SessionStatus,
      tutorName: s.tutor.name,
      enrollment: e.status as StudentSession["enrollment"],
    };
  });
}
