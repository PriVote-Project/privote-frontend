import Link from "next/link";
import Image from "next/image";
import { Poll, PollStatus } from "~~/types/poll";
import { Circle } from "~~/app/Circle";
import styles from "./index.module.css";

interface PollsListItemProps {
  poll: Poll;
}

const AuthTypeMapping: { [key: string]: string } = {
  wc: "worldcoin",
  anon: "anon-icon",
  nfc: "nfc-icon",
};

const PollsListItem = ({ poll }: PollsListItemProps) => {
  const metadata = JSON.parse(poll.metadata);
  return (
    <li className={styles["polls-list-item"]}>
      <Link
        href={`/polls/${Number(poll.id)}?authType=${poll.authType}&pollType=${
          metadata.pollType
        }`}
      >
        <div
          className={`${styles["poll-status"]} ${
            poll.status === PollStatus.OPEN
              ? styles.live
              : poll.status === PollStatus.NOT_STARTED
              ? styles.notStarted
              : styles.ended
          }`}
        >
          <Circle />{" "}
          {poll.status === PollStatus.OPEN
            ? "Live now"
            : poll.status === PollStatus.NOT_STARTED
            ? "Not Started"
            : "Ended"}
        </div>
        <div className={styles.container}>
          <div className={styles.left}>
            <div className={styles.heading}>
              <h2>{poll.name} </h2>
              {AuthTypeMapping[poll.authType] && (
                <Image
                  src={`/${AuthTypeMapping[poll.authType]}.svg`}
                  width={26}
                  height={26}
                  alt="icon"
                />
              )}
            </div>
            <p>{Number(poll.numOfOptions)} Candidates</p>
          </div>
          <div className={styles.right}>
            <p>
              <span>Start Time</span>
              <span>:</span>
              <span>
                {new Date(Number(poll.startTime) * 1000)
                  .toLocaleString("sv")
                  .replace(" ", ", ")
                  .slice(0, -3)}
              </span>
            </p>
            <p>
              <span>End Time</span>
              <span>:</span>
              <span>
                {new Date(Number(poll.endTime) * 1000)
                  .toLocaleString("sv")
                  .replace(" ", ", ")
                  .slice(0, -3)}
              </span>
            </p>
          </div>
        </div>
        {poll.status === PollStatus.RESULT_COMPUTED && (
          <Link
            href={`/polls/${poll.id}?authType=${poll.authType}&pollType=${metadata.pollType}`}
            className={styles["poll-btn"]}
          >
            <p>View Results</p>
          </Link>
        )}
      </Link>
    </li>
  );
};

export default PollsListItem;
