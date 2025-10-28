import { PrismaClient } from '@prisma/client';
import { encrypt } from '../lib/utils/encryption';

const prisma = new PrismaClient();

async function migrateTokens() {
  try {
    // Get all sessions with unencrypted tokens
    const sessions = await prisma.session.findMany({
      where: {
        accessToken: {
          not: null
        }
      }
    });

    console.log(`Found ${sessions.length} sessions to migrate`);

    for (const session of sessions) {
      if (
        session.accessToken &&
        typeof session.accessToken === 'string' // Only encrypt if it's a string (unencrypted)
      ) {
        // Encrypt the token
        const encryptedToken : any = encrypt(session.accessToken);

        // Update the session with encrypted token
        await prisma.session.update({
          where: { id: session.id },
          data: {
            accessToken: encryptedToken
          }
        });

        console.log(`Encrypted token for session ${session.id}`);
      }
    }

    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

migrateTokens(); 