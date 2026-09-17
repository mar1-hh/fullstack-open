const obj = {
    name: "7mad",
    func:  () => {
        return (this.name)
    }
}

const test = () => 5 + 3

console.log(obj.func())