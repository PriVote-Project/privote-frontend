import styles from "./index.module.css";
import Image from "next/image";
import PollOption from "../PollOption";
import { IoMdClose } from "react-icons/io";
import { CandidateSelectionProps } from "../../types";

const CandidateSelection = ({
  candidateSelection,
  setCandidateSelection,
  handleAddOption,
  handleOptionChange,
  options,
  files,
  onFileChange,
  onFileRemove,
  onRemoveOption,
}: CandidateSelectionProps) => {
  return (
    <div className={styles["candidate-box"]}>
      <div className={styles["candidate-header"]}>
        <h1>Add your options</h1>
        {(candidateSelection === "withImage" ||
          candidateSelection === "withoutImage") && (
          <div className={styles["candidate-add"]}>
            <button
              type="button"
              className={styles["change-selection"]}
              onClick={() => {
                setCandidateSelection("none");
              }}
            >
              <IoMdClose size={30} fill="#fff" />
            </button>
            <button
              type="button"
              className={styles["add-candidate-btn"]}
              onClick={handleAddOption}
            >
              <Image
                src={"/plus-circle.svg"}
                width={32}
                height={32}
                alt="plus circle"
              />
              Add option
            </button>
          </div>
        )}
      </div>
      {candidateSelection === "none" ? (
        <div className={styles.actions}>
          <button
            type="button"
            className={styles["selection-btn"]}
            onClick={() => setCandidateSelection("withoutImage")}
          >
            <p>Add Candidate</p>
          </button>
          <button
            type="button"
            className={styles["selection-btn"]}
            onClick={() => setCandidateSelection("withImage")}
          >
            <p>Add Candidate with Image</p>
          </button>
        </div>
      ) : (
        <div>
          <div className={styles["candidates-list"]}>
            {options.map((option, index) => (
              <PollOption
                key={index}
                option={option}
                index={index}
                file={files?.[index] || null}
                onOptionChange={handleOptionChange}
                onFileChange={onFileChange}
                onFileRemove={onFileRemove}
                onRemoveOption={onRemoveOption}
                candidateSelection={candidateSelection}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidateSelection;
