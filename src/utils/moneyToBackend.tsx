export default function moneyToBackend(money: string){
    //remove R$ unit
    money = money.replace(' ', '');

    if(money.indexOf("R$") >= 0){
        money = money.substring(2);
    }

    //parse string to double format
    console.log(money);
    money = money.replace(' ', '').replaceAll('.', '').replace(',', '.');

    return money;
}