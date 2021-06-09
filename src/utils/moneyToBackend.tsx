export default function moneyToBackend(money: string){
    //remove R$ unit
    if(money.indexOf("R$")){
        money.substring(3);
    }

    //parse string to double format
    money = money.replace('.', '').replace(',', '.');

    return money;
}