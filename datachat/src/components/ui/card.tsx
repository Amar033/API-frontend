import { Icon } from 'lucide-react'
import React from 'react'
import { IconType } from 'react-icons/lib'
export interface CardTypes {
    icon: IconType
    heading: string
    desc: string
    contact: string
}

const Card: React.FC<CardTypes > = ({ icon: Icons, heading, desc, contact }) => {
    return (
        <div className="flex flex-col items-center text-center">
            <Icons className="h-10 w-10 mb-4 text-purple-400" />
            <h4 className="text-xl font-bold mb-2">{heading}</h4>
            <p className="text-gray-400">{desc}</p>
            <a href="mailto:hello@connectdb.com" className="text-purple-300 hover:underline mt-2">{contact}</a>
        </div>
    )
}

export default Card