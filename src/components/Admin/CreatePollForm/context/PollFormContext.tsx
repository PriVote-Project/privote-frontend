import usePrivoteContract from '@/hooks/usePrivoteContract';
import { PollPolicyType, PollType } from '@/types';
import { getWrapperFunctionName } from '@/utils/getWrapperFunctionName';
import { uploadFileToLighthouse } from '@/utils/lighthouse';
import { handleNotice, notification } from '@/utils/notification';
import { encodeOptionInfo } from '@/utils/optionInfo';
import { Keypair, PublicKey } from '@maci-protocol/domainobjs';
import { CID } from 'multiformats';
import { useRouter } from 'next/navigation';
import { createContext, useContext, useState, type ReactNode } from 'react';
import { useWriteContract } from 'wagmi';
import type { IPollData, PolicyConfigType } from '../types';
import { getPollArgs } from './utils';

const initialPollData: IPollData = {
  title: '',
  description: '',
  startTime: new Date(Date.now() + 5 * 60 * 1000),
  endTime: new Date(Date.now() + 60 * 60 * 1000),
  maxVotePerPerson: 1,
  pollType: PollType.NOT_SELECTED,
  mode: null,
  options: [
    {
      title: '',
      description: '',
      cid: '0x' as `0x${string}`,
      link: '',
      isUploadedToIPFS: false
    },
    {
      title: '',
      description: '',
      cid: '0x' as `0x${string}`,
      link: '',
      isUploadedToIPFS: false
    }
  ],
  keyPair: new Keypair(),
  publicKey: '',
  policyType: PollPolicyType.FreeForAll,
  policyConfig: {}
};

interface PollFormContextType {
  pollData: IPollData;
  setPollData: React.Dispatch<React.SetStateAction<IPollData>>;
  files: (File | null)[] | null;
  isLoading: boolean;
  showKeys: { show: boolean; privateKey: string };
  setShowKeys: React.Dispatch<React.SetStateAction<{ show: boolean; privateKey: string }>>;
  pollConfig: number;
  setPollConfig: React.Dispatch<React.SetStateAction<number>>;
  generateKeyPair: () => void;
  candidateSelection: 'none' | 'withImage' | 'withoutImage';
  setCandidateSelection: React.Dispatch<React.SetStateAction<'none' | 'withImage' | 'withoutImage'>>;
  handleOptionChange: (index: number, value: string, field: 'value' | 'title' | 'description' | 'link') => void;
  handleFileChange: (index: number, file: File) => void;
  handleFileRemove: (index: number) => void;
  handleAddOption: () => void;
  handleRemoveOption: (index: number) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  handlePolicyTypeChange: (e: React.ChangeEvent<any>) => void;
  handlePolicyConfigChange: (config: PolicyConfigType) => void;
  // showFaucetModal: boolean
  // onCloseFaucetModal: () => void
}

const PollFormContext = createContext<PollFormContextType | undefined>(undefined);

export const PollFormProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const [pollData, setPollData] = useState<IPollData>(initialPollData);
  const [files, setFiles] = useState<(File | null)[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [candidateSelection, setCandidateSelection] = useState<'none' | 'withImage' | 'withoutImage'>('none');
  const [showKeys, setShowKeys] = useState({ show: false, privateKey: '' });
  const [pollConfig, setPollConfig] = useState(0);

  const { writeContractAsync } = useWriteContract();
  const privoteContract = usePrivoteContract();

  const generateKeyPair = () => {
    const keyPair = new Keypair();

    setPollData(prev => ({
      ...prev,
      publicKey: keyPair.toJSON().publicKey
    }));
    setShowKeys({ show: true, privateKey: keyPair.toJSON().privateKey });
  };

  const validateForm = (): boolean => {
    if (!pollData.title.trim()) {
      notification.error('Please enter a title');
      return false;
    }

    // Removed description validation
    if (!pollData.description.trim()) {
      notification.error('Please enter a description');
      return false;
    }

    if (pollData.startTime.getTime() > pollData.endTime.getTime()) {
      console.log('Start time should be less than end time');
      notification.error('Start time should be less than end time');
      return false;
    }

    if (pollData.startTime.getTime() < Date.now()) {
      console.log('Start time should be greater than current time');
      notification.error('Start time should be greater than current time');
      return false;
    }

    if (pollData.pollType === null) {
      console.log('Please select a poll type');
      notification.error('Please select a poll type');
      return false;
    }

    if (pollData.mode === null) {
      console.log('Please select a voting mode');
      notification.error('Please select a voting mode');
      return false;
    }

    if (pollData.options.filter(opt => !opt.title?.trim()).length > 0) {
      console.log('Please add at least 1 option');
      notification.error('Please add at least 1 option');
      return false;
    }

    if (!PublicKey.isValidSerialized(pollData.publicKey)) {
      console.log('Please enter a valid public key');
      notification.error('Please enter a valid public key');
      return false;
    }

    // If link is present on option then it should be a valid url
    const validUrlReges = new RegExp(
      '((http|https)://)(www.)?[a-zA-Z0-9@:%._\\+~#?&//=]{2,256}\\.[a-z]{2,6}\\b([-a-zA-Z0-9@:%._\\+~#?&//=]*)'
    );

    for (const option of pollData.options) {
      if (option.link && !validUrlReges.test(option.link)) {
        console.log('Please enter a valid URL for Candidate : ' + option.title);
        notification.error('Please enter a valid URL for Candidate : ' + option.title);
        return false;
      }
    }

    return true;
  };

  const handleOptionChange = (index: number, value: string, field: string) => {
    setPollData(prev => ({
      ...prev,
      options: prev.options.map((opt, i) => (i === index ? { ...opt, [field]: value } : opt))
    }));
  };

  const handleFileChange = (index: number, file: File) => {
    setFiles(prev => {
      const newFiles = prev ? [...prev] : [];
      newFiles[index] = file;
      return newFiles;
    });
  };

  const handleFileRemove = (index: number) => {
    setFiles(prev => {
      const newFiles = prev ? [...prev] : [];
      newFiles[index] = null;
      return newFiles;
    });
  };

  const handlePolicyTypeChange = (e: React.ChangeEvent<any>) => {
    // When changing policy type, reset the policy config to prevent invalid configs
    setPollData({
      ...pollData,
      policyType: e.target.value,
      policyConfig: {} // Reset policy config when changing policy type
    });
  };

  const handlePolicyConfigChange = (config: PolicyConfigType) => {
    setPollData({
      ...pollData,
      policyConfig: {
        ...pollData.policyConfig,
        ...config
      }
    });
  };

  const handleAddOption = () => {
    setPollData(prev => ({
      ...prev,
      options: [...prev.options, { value: '', cid: '0x' as `0x${string}`, isUploadedToIPFS: false }]
    }));
  };

  const handleRemoveOption = (index: number) => {
    setPollData(prev => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index)
    }));
    setFiles(prev => {
      if (!prev) return prev;
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (!privoteContract) {
      notification.error('Please connect to supported chains!');
      return;
    }

    setIsLoading(true);
    let notificationId = '';
    try {
      const cids: `0x${string}`[] = [];

      if (files && files.length > 0) {
        notificationId = notification.loading('Uploading files to IPFS...');
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          if (!file) {
            cids[i] = '0x';
            continue;
          }
          const data = await uploadFileToLighthouse([file]);
          console.log(data);
          const cid = CID.parse(data.Hash);
          console.log(cid);
          cids[i] = `0x${Buffer.from(cid.bytes).toString('hex')}`;
        }
      }

      notificationId = handleNotice({
        id: notificationId,
        message: 'preparing to create poll',
        type: 'loading'
      });

      const finalPollData = {
        ...pollData,
        options: pollData.options.map((option, i) => ({
          ...option,
          cid: cids[i] || '0x',
          isUploadedToIPFS: !!cids[i]
        }))
      };

      const startTime = BigInt(Math.floor(finalPollData.startTime.getTime() / 1000));
      const endTime = finalPollData.endTime ? BigInt(Math.floor(finalPollData.endTime.getTime() / 1000)) : 0n;

      const encodedOptions = await Promise.all(
        finalPollData.options.map(async option => {
          return encodeOptionInfo({
            cid: option.isUploadedToIPFS ? option.cid : ('0x' as `0x${string}`),
            description: option.description ?? '',
            link: option.link ?? ''
          });
        })
      );

      // Generate the arguments for the contract call using the utility function
      const args = getPollArgs({
        pollData: finalPollData,
        encodedOptions,
        startTime,
        endTime
      });

      console.log(args);

      notificationId = handleNotice({
        id: notificationId,
        message: 'Creating poll...',
        type: 'loading'
      });

      console.log(getWrapperFunctionName(finalPollData.policyType));

      await writeContractAsync(
        {
          abi: privoteContract.abi,
          address: privoteContract.address,
          functionName: getWrapperFunctionName(finalPollData.policyType),
          args: args as any
        },
        {
          onError: error => {
            console.log('Failed to create poll', error);
            handleNotice({
              message: 'Failed to create Poll',
              type: 'error',
              id: notificationId
            });
          },
          onSuccess: () =>
            handleNotice({
              message: 'Poll created successfully!',
              type: 'success',
              id: notificationId
            })
        }
      );

      setIsLoading(false);
      router.push('/polls');
    } catch (error) {
      console.error('Error creating poll:', error);
      notification.error('Failed to create poll');
    } finally {
      setIsLoading(false);
      if (notificationId) notification.remove(notificationId);
    }
  };

  const value = {
    pollData,
    setPollData,
    files,
    isLoading,
    showKeys,
    setShowKeys,
    pollConfig,
    setPollConfig,
    generateKeyPair,
    candidateSelection,
    setCandidateSelection,
    handleOptionChange,
    handleFileChange,
    handleFileRemove,
    handleAddOption,
    handleRemoveOption,
    handleSubmit,
    handlePolicyTypeChange,
    handlePolicyConfigChange
  };

  return <PollFormContext.Provider value={value}>{children}</PollFormContext.Provider>;
};

export const usePollForm = () => {
  const context = useContext(PollFormContext);
  if (context === undefined) {
    throw new Error('usePollForm must be used within a PollFormProvider');
  }
  return context;
};
