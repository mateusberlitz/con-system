import { CompanySelectMaster } from "../../components/CompanySelect/companySelectMaster";
import { MainBoard } from "../../components/MainBoard";

export default function Commercial(){
    return (
        <MainBoard sidebar="commercial" header={<CompanySelectMaster/>}>

        </MainBoard>
    )
}