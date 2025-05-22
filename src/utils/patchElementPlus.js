import { ElTimeline } from "element-plus";

// delete ElDialog.render
const myElTimeline = {
    extends: ElTimeline,
    render(h) {
        const {
            active,
            opened,
            paddingStyle,
            titleStyle,
            backgroundColor,
            rootMenu,
            currentPlacement,
            menuTransitionName,
            mode,
            disabled,
            popperClass,
            $slots,
            isFirstLevel
        } = this;

        return (
            ""
        );
    },
    methods: {
        subRouter() {
            this.$router.push(this.index)
        }
    },
}


export default {
    install(Vue) {
        Vue.component(myElTimeline.name, myElTimeline)
    }
}