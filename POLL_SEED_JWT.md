# Poll Seed JWT System

This system provides poll-specific MACI keypairs that persist across sessions via JWT cookies. Users can have different keypairs for different polls, and these keypairs are tied to the poll duration.

## How It Works

1. **Authentication**: User signs in with Porto + SIWE
2. **Poll Keypair Generation**: When joining a poll, user signs a poll-specific message
3. **JWT Storage**: The signature seed is stored in a JWT cookie that expires with the poll
4. **Deterministic Keypairs**: The same signature always generates the same MACI keypair
5. **Session Persistence**: Users can return later and use the same keypair for voting/revoting

## API Endpoints

### POST `/api/poll/seedJWT/`
Creates a new poll-specific seed JWT.

**Request Body:**
```json
{
  "pollId": "1",
  "pollEndDate": "2024-12-31T23:59:59Z",
  "signatureSeed": "0x123..."
}
```

**Response:**
```json
{
  "success": true,
  "cookieName": "poll-seed-1",
  "expiresAt": "2024-12-31T23:59:59Z"
}
```

### GET `/api/poll/seedJWT/?pollId=1`
Gets existing poll seed JWT.

**Response:**
```json
{
  "exists": true,
  "signatureSeed": "0x123...",
  "expiresAt": "2024-12-31T23:59:59Z"
}
```

## Usage

### 1. In Poll Pages

Wrap your poll page with the poll-specific context:

```tsx
import PollSigContextWrapper from '@/contexts/PollSigContextWrapper';

function PollPage({ pollId, pollEndDate }: { pollId: string; pollEndDate: string }) {
  return (
    <PollSigContextWrapper pollId={pollId} pollEndDate={pollEndDate}>
      <PollContent />
    </PollSigContextWrapper>
  );
}
```

### 2. Generate Poll Keypair

The poll keypair is automatically generated when users click "Join Poll" and go through the join flow. The existing join poll modal now handles poll-specific keypair generation seamlessly.

**Flow:**
1. User clicks "Join Poll"
2. If no poll keypair exists, user is prompted to "Generate Poll Keypair"
3. Once generated, user can proceed to register (if not already registered)
4. Then complete the poll join process

### 3. Using SigContext in Poll Mode

```tsx
import { useSigContext } from '@/contexts/SigContext';

function VotingComponent() {
  const { 
    maciKeypair,
    isPollMode,
    currentPollId,
    generatePollKeypair,
    hasPollKeypair
  } = useSigContext();

  const handleVote = async () => {
    if (!maciKeypair) {
      console.log('No poll keypair available');
      return;
    }

    // Use maciKeypair for voting
    console.log('Voting with keypair:', maciKeypair.publicKey.serialize());
  };

  return (
    <button onClick={handleVote}>
      Vote
    </button>
  );
}
```

## Key Features

### 🔐 **Deterministic Keypairs**
- Same signature always generates the same keypair
- Users can return and vote with the same identity

### ⏰ **Poll-Specific Expiry**
- JWTs expire when the poll ends
- No lingering session data after polls close

### 🍪 **Cookie Storage**
- Server-side storage via HTTP-only cookies
- Automatic cleanup on expiry

### 🔄 **Fallback Support**
- Regular mode uses localStorage (existing behavior)
- Poll mode uses JWT cookies
- Seamless switching between modes

## Security Considerations

1. **JWT Secret**: Use a strong `JWT_SECRET` environment variable
2. **HTTPS**: Always use HTTPS in production for secure cookies
3. **Expiry**: JWTs automatically expire with poll end date
4. **Authentication**: Requires valid SIWE session to create poll keypairs

## Environment Variables

```bash
JWT_SECRET=your-very-secure-secret-key-here
```

## Migration

Existing code continues to work unchanged. Poll-specific functionality is opt-in:

- **Without `pollId`**: Uses localStorage keypairs (existing behavior)
- **With `pollId`**: Uses JWT-based poll keypairs (new behavior)

## Example Flow

1. User signs in with Porto + SIWE ✓
2. User visits poll page (automatically wrapped with `PollSigContextWrapper`)
3. User clicks "Join Poll" button
4. **Join Poll Modal - Step 1:**
   - If no poll keypair: Shows "Generate Poll Keypair" button
   - User clicks → System creates poll-specific signature  
   - JWT is stored in cookie `poll-seed-{pollId}`
   - MACI keypair is generated from seed
5. **Join Poll Modal - Step 1 (continued):**
   - If not registered: Shows "Register with Privote" button
   - User registers using the poll-specific keypair
6. **Join Poll Modal - Steps 2-3:**
   - User completes policy verification and joins poll
7. User can vote/revote until poll ends using the same keypair
8. Cookie expires automatically when poll ends
