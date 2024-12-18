"use client";
import Link from "next/link";
import Image from "next/image";
import styles from "~~/styles/pollDetails.module.css";
import { useParams } from "next/navigation";
import { PollDetails } from "~~/components/Poll";
import { useAuthContext } from "~~/contexts/AuthContext";
import { useFetchPoll } from "~~/hooks/useFetchPoll";
import Button from "~~/components/ui/Button";

const UserPoll = () => {
  const { isRegistered } = useAuthContext();
  const params = useParams();
  const pollId = params.id;
  const { error, isLoading } = useFetchPoll(BigInt(Number(pollId)));

  if (error) {
    return (
      <div className={styles.container}>
        <Link href={"/"} className={styles.back}>
          <Image src="/arrow-left.svg" alt="arrow left" width={27} height={27} />
        </Link>
        <div className={styles["error-state"]}>
          <h3>Failed to Load Poll</h3>
          <p>We couldn't load the poll details. Please try again later.</p>
          <Button
            className={styles["retry-btn"]}
            action={() => window.location.reload()}
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={styles.container}>
        <Link href={"/"} className={styles.back}>
          <Image src="/arrow-left.svg" alt="arrow left" width={27} height={27} />
        </Link>
        <div className={styles["loading-state"]}>
          <div className="spinner large"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Link href={"/"} className={styles.back}>
        <Image src="/arrow-left.svg" alt="arrow left" width={27} height={27} />
      </Link>
      <PollDetails
        id={BigInt(Number(pollId))}
        isUserRegistered={isRegistered}
      />
    </div>
  );
};

export default UserPoll;
