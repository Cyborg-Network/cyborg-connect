import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import Modal from '../../general/modals/Modal'
import CloseButton from '../../general/buttons/CloseButton'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '../../../../index'
import Button from '../../general/buttons/Button'
import useTransaction from '../../../api/parachain/useTransaction'
import { useParachain } from '../../../context/PapiContext'
import { Binary, Enum} from 'polkadot-api'
import { useToast } from '../../../context/ToastContext'
//import * as Select from "@radix-ui/react-select"
import { MinerReactRouterState } from '../../../types/miner'

interface Props {
  setService: (service: string | null) => void
  onCancel: () => void
  nodes: MinerReactRouterState
}

/*
interface CyCloudTaskDropdownProps {
  selectedDeploymentType: CyCloudTaskType
  handleSelectDeploymentType: (cyCloudTaskType: CyCloudTaskType, userIdentifier: string) => void
  userIdentifier: string
}
*/

//type CyCloudEnum = EnumVariant<{type: string; value: any;}, "CyCloud">;
//type CyCloudTaskType = "Vm" | "Container" | "Native";

/*
const CyCloudTaskDropdown: React.FC<CyCloudTaskDropdownProps> = ( {
  selectedDeploymentType, 
  handleSelectDeploymentType,
  userIdentifier
}: CyCloudTaskDropdownProps ) => {

  let cyCloudTaskVariant = [
    "Vm", 
    "Container", 
    "Native",
  ];

  return (
    <div className="z-40 flex-col gap-2 justify-center items-center">
      <Select.Root
        value={selectedDeploymentType}
        onValueChange={(value: CyCloudTaskType) => {
          handleSelectDeploymentType(value, userIdentifier)
        }}
      >
        <Select.Trigger className="bg-color-background-3 border border-color-foreground flex items-center gap-2 px-4 py-2 text-white rounded-lg shadow-md hover:bg-color-background-4 min-w-[200px]">
          <Select.Value placeholder="Select Deployment Type">
            {selectedDeploymentType
              ? selectedDeploymentType
              : 'Select Deployment Type'
            }
          </Select.Value>
        </Select.Trigger>
        <Select.Content side="bottom" sideOffset={5} align="start" position="popper" className="bg-color-background-2 rounded-lg shadow-lg overflow-hidden min-w-[200px]">
          {cyCloudTaskVariant.map(item => (
            <Select.Item
              key={item}
              value={item}
              className="px-4 py-2 text-white cursor-pointer hover:bg-color-background-4"
            >
            {item}
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Root>
    </div>
  )
}
*/

const CyCloudTaskDeployment: React.FC<Props> = ({
  setService,
  onCancel,
  nodes,
}: Props) => {

  const navigate = useNavigate()
  const { showToast } = useToast()
  const { account, parachainApi } = useParachain()
  const { handleTransaction } = useTransaction()

  const [computeHoursDeposit, setComputeHoursDeposit] = useState('')
  //const [cyCloudTaskType, setCyCloudTaskType] = useState<CyCloudTaskType | null>()
  const [userIdentifier, setUserIdentifier] = useState<string | null>(null)

  useEffect(() => {
    console.log(userIdentifier)
  }, [userIdentifier])

  useEffect(() => {
    console.log(nodes[0])
  }, [nodes])


  const handleComputeHourDepositChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setComputeHoursDeposit(e.target.value);
  }

  const handleUserIdentifierChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserIdentifier(e.target.value);
  }

  /*
  const handleSetCyCloudTaskType = (cyCloudTaskType: CyCloudTaskType) => {
    setCyCloudTaskType(cyCloudTaskType);
  }
  */

  const navigateToDashboard = () => {
    navigate(ROUTES.DASHBOARD)
  }

  const submitTransaction = async (parsedHoursDeposit: number) => {
    if (!userIdentifier) {
      showToast({isErr: true, title: "Failed", text: "Please specify an identifier (eg. username, container name) for the task!" , type: "general"})
      return
    }

    /*
    if (!cyCloudTaskType) {
      showToast({isErr: true, title: "Failed", text: "No CyCloud task type selected" , type: "general"})
      return
    }

    let taskType: CyCloudEnum;
    switch (cyCloudTaskType) {
      case "Vm":
        taskType =  Enum("CyCloud", { type: "Vm", value: Binary.fromText(userIdentifier) } )
        break;
      case "Native":
        taskType =  Enum("CyCloud", { type: "Native", value: Binary.fromText(userIdentifier) } )
        break;
      case "Container":
        taskType =  Enum("CyCloud", { type: "Container", value: Binary.fromText(userIdentifier) } )
        break;
    }
    */

   let taskType = Enum("CyCloud", { type: "Native", value: Binary.fromText(userIdentifier) } );

    const tx = parachainApi.tx.TaskManagement.task_scheduler({
      task_kind: taskType,
      miner_id: Binary.fromText(nodes.id),
      compute_hours_deposit: parsedHoursDeposit
    });

    await handleTransaction({
      tx, 
      account, 
      userCallToAction: {
        fn: navigateToDashboard,
        text: "Navigate To Dashboard"
      },
      onSuccessFn: navigateToDashboard,
      txName: "CyCloud Task"
    })
  }

  const handleSubmit = async () => {
    const parsedHoursDeposit = parseInt(computeHoursDeposit)
    if (isNaN(parsedHoursDeposit)) {
      toast('Please input a valid number of compute hours!')
      return
    }

    submitTransaction(parsedHoursDeposit)
  }

  return (
    <Modal onOutsideClick={() => onCancel()}>
      <CloseButton
        type="button"
        onClick={() => onCancel()}
        additionalClasses="absolute top-6 right-6"
      />
      <div>
        <h2 className="mb-4 text-color-text-1">Deploy Task to CyCloud</h2>

        {/*
        // Commented out since we don't allow different task types, at least for now
        <div className="flex gap-4 items-center">
          <h5 className="m-0">Task Type</h5>
          <CyCloudTaskDropdown userIdentifier={userIdentifier} handleSelectDeploymentType={handleSetCyCloudTaskType} selectedDeploymentType={cyCloudTaskType} />
        </div>
        */}

        <h5 className="flex text-color-text-1">User Name</h5>
        <div className="mb-4">
          <input
            type="text"
            id="url"
            name="url"
            placeholder="Select the user name that you want to use"
            onChange={e => handleUserIdentifierChange(e)}
            className="focus:border-color-foreground text-color-background-2 border border-color-text-1 rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <h5 className="flex text-color-text-1">Deposit Compute Hours</h5>
        <div className="mb-4">
          <input
            type="text"
            id="url"
            name="url"
            placeholder="Insert Number of Compute Hours"
            onChange={e => handleComputeHourDepositChange(e)}
            className="focus:border-color-foreground text-color-background-2 border border-color-text-1 rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className=" flex items-center justify-between">
            <Button
              type="button"
              selectable={false}
              variation="secondary"
              onClick={() => setService(null)}
              additionalClasses="w-full"
            >
              Close
            </Button>
          </div>
          <div className=" flex items-center justify-between">
            <Button
              type="button"
              selectable={false}
              variation="primary"
              onClick={() => handleSubmit()}
              additionalClasses="w-full"
            >
              Submit
            </Button>
          </div>
        </div>

      </div>
    </Modal>
  )
}

export default CyCloudTaskDeployment
