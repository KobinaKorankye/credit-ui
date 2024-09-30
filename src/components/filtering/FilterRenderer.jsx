import React, { useState } from "react";
import ObjSelect from "../forms/ObjSelect";
import AppInput from "../forms/AppInput";
import { attributeObjMapping, filterAttributes, numericColumns } from "../../constants";
import { filterToString, operationDescriptions } from "../../helpers";
import ActionButton from "../ActionButton";
import { BiPlusCircle } from "react-icons/bi";
import Modal2 from "../modals/Modal2";
import { FiX } from "react-icons/fi";
import useRefState from "../../hooks/useRefState";

export default function FilterRenderer({ filter, filters, setFilters }) {
    const [isAddSubFilterModalOpen, setIsAddSubFilterModalOpen] = useState(false);
    const [subFilter, setSubFilter] = useState({ attribute: " " })
    const [innerFilterArray, setInnerFilterArray] = useRefState({})

    return (
        <>
            <Modal2 isOpen={isAddSubFilterModalOpen}>
                <div onClick={() => { setIsAddSubFilterModalOpen(false) }} className="w-screen h-screen flex flex-col items-center p-20 items-center bg-black/50">
                    <div onClick={(e) => { e.stopPropagation() }} className="max-w-full max-h-full overflow-y-auto bg-white px-14 pt-5 pb-10 rounded">
                        <div className="flex justify-end"> <FiX className="text-lg cursor-pointer" onClick={() => { setIsAddSubFilterModalOpen(false) }} /></div>
                        <div className="text-xl font-semibold">Add Filter</div>
                        <div className="grid grid-cols-3 gap-x-5 gap-y-8 px-5 mt-3">
                            <ObjSelect value={subFilter?.attribute} onChange={(e) => { setSubFilter((prev) => ({ ...prev, attribute: e.target.value })) }} name={'attribute'} label={'Attribute'} options={filterAttributes} />
                            {subFilter.attribute !== " " && (
                                <>
                                    {
                                        [...numericColumns, 'income'].includes(subFilter.attribute) ?
                                            <>
                                                <ObjSelect value={subFilter?.operation} onChange={(e) => { setSubFilter((prev) => ({ ...prev, operation: e.target.value })) }} name={'operation'} label={'Operation'} options={operationDescriptions} />
                                                <AppInput value={subFilter?.operand} onChange={(e) => { setSubFilter((prev) => ({ ...prev, operand: e.target.value })) }} name={'operand'} label={'Operand'} />
                                            </>
                                            :
                                            <>
                                                <ObjSelect value={subFilter?.operation} onChange={(e) => { setSubFilter((prev) => ({ ...prev, operation: e.target.value })) }} name={'operation'} label={'Operation'} options={{ eq: "equals", neq: 'not equal to' }} />
                                                <ObjSelect sameValue value={subFilter?.operand} onChange={(e) => { setSubFilter((prev) => ({ ...prev, operand: e.target.value })) }} name={'operand'} label={'Operand'} options={attributeObjMapping[subFilter.attribute]} />
                                            </>
                                    }
                                </>
                            )}
                        </div>
                        {
                            (subFilter.operand && subFilter.operation) &&
                            <>
                                <div className="mx-5 mt-5">
                                    <div className="flex bg-gray-100 border border-gray-300 shadow rounded-xl px-4 py-1 font-mono mt-8 text-sm">{filterToString(subFilter)}</div>
                                    <ActionButton text={'Save'} noIcon onClick={() => {
                                        innerFilterArray.push(subFilter); setFilters(filters); setIsAddSubFilterModalOpen(false);
                                    }} className={'bg-primary text-white mt-5'} />
                                </div>
                            </>
                        }

                    </div>
                </div>
            </Modal2>
            {
                (() => {
                    if (filter?.and) {
                        // For 'and', join each condition with 'AND'
                        return (
                            <div className="px-4 pt-2 pb-3 border border-gray-300 shadow">
                                <div className="font-bold text-xs text-primary mb-2">AND</div>
                                {
                                    filter.and.map((f) => (
                                        <FilterRenderer filter={f} filters={filters} setFilters={setFilters} />
                                    ))
                                }
                                <div className="flex mt-4 mx-5 justify-start">
                                    <div className="flex bg-dark rounded-full p-1"><BiPlusCircle onClick={() => { setSubFilter({ attribute: ' ' }); setInnerFilterArray(filter.and); setIsAddSubFilterModalOpen(true) }} className="text-white text-xl cursor-pointer" /></div>
                                </div>
                            </div>)
                    } else if (filter?.or) {
                        // For 'or', join each condition with 'OR'
                        return (
                            <div className="px-4 pt-2 pb-3 border border-gray-300 shadow">
                                <div className="font-bold text-xs text-surface-light">OR</div>
                                {
                                    filter.or.map((f) => (
                                        <FilterRenderer filter={f} filters={filters} setFilters={setFilters} />
                                    ))
                                }
                                <div className="flex mt-4 mx-5 justify-start">
                                    <div className="flex bg-dark rounded-full p-1"><BiPlusCircle onClick={() => { setSubFilter({ attribute: ' ' }); setInnerFilterArray(filter.or); setIsAddSubFilterModalOpen(true) }} className="text-white text-xl cursor-pointer" /></div>
                                </div>
                            </div>)
                    } else if (filter?.not) {
                        // For 'not', prefix the condition with 'NOT'
                        return (
                            <>
                                <div className="font-bold font-serif text-xs text-secondary">NOT</div>
                                <FilterRenderer filter={filter.not[0]} filters={filters} setFilters={setFilters} />
                            </>)
                    } else {
                        // For single conditions, construct the comparison string
                        const { attribute, operation, operand } = filter;

                        if (!attribute) {
                            return null
                        }

                        return (
                            <div className="grid grid-cols-3 gap-x-5 gap-y-8 px-5 mt-3">
                                <ObjSelect noEmpty value={attribute} onChange={(e) => { filter.attribute = e.target.value; setFilters(filters) }} name={'attribute'} label={'Attribute'} options={filterAttributes} />
                                {[...numericColumns, 'income'].includes(attribute) ?
                                    <>
                                        <ObjSelect noEmpty value={operation} onChange={(e) => { filter.operation = e.target.value; setFilters(filters) }} name={'operation'} label={'Operation'} options={operationDescriptions} />
                                        <AppInput value={operand} onChange={(e) => { filter.operand = e.target.value; setFilters(filters) }} name={'operand'} label={'Operand'} />
                                    </>
                                    :
                                    <>
                                        <ObjSelect noEmpty value={operation} onChange={(e) => { filter.operation = e.target.value; setFilters(filters) }} name={'operation'} label={'Operation'} options={{ eq: "equals", neq: 'not equal to' }} />
                                        <ObjSelect sameValue noEmpty value={operand} onChange={(e) => { filter.operand = e.target.value; setFilters(filters) }} name={'operand'} label={'Operand'} options={attributeObjMapping[attribute]} />
                                    </>}
                            </div>
                        )
                    }
                })()
            }
        </>
    )
}