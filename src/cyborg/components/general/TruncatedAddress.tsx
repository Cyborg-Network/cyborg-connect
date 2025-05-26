import React from 'react'
import { truncateAddress } from '../../util/truncateAddress'
import CopyToClipboard from 'react-copy-to-clipboard'
import { IoMdCopy } from 'react-icons/io'
import { useState } from 'react'

interface Props {
  address: string
  screenWidth: number
  additionalClasses?: string
}

const TruncatedAddress: React.FC<Props> = ({
  address,
  screenWidth,
  additionalClasses,
}: Props) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <>
      {/*
    isHovered
    ?
    <div className="fixed bottom-500 left-1/2 -translate-x-1/2 p-3 text-cb-green bg-black border border-cb-green rounded-lg hover:cursor-pointer">
      {address}
    </div>
    :
    <></>
    */}
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="hover:cursor-pointer"
      >
        <div className={`relative w-fit ${additionalClasses}`}>
          {truncateAddress(address, screenWidth)}
          {isHovered ? (
            <CopyToClipboard text={address}>
              <div className="absolute -right-8 top-1/2 -translate-y-1/2 bg-black bg-opacity-30 rounded-lg text-cb-green p-2">
                <IoMdCopy size={15} />
              </div>
            </CopyToClipboard>
          ) : (
            <></>
          )}
        </div>
      </div>
    </>
  )
}

export default TruncatedAddress
