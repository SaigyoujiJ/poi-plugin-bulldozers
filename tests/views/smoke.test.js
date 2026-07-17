// 视图冒烟测试：import 所有不依赖 poi 运行时的视图模块。
// 语法错误（如重复声明）在 poi 加载插件时才会暴露，这里提前拦截。
// AppPanel / PresetBar / index.es 依赖 poi's views/* 模块，无法在 Jest 中解析，不在此列。
import PlanePicker from '../../views/PlanePicker'
import CategoryTabs from '../../views/PlanePicker/CategoryTabs'
import PlaneList from '../../views/PlanePicker/PlaneList'
import SlotRow from '../../views/SlotRow'
import SquadronEditor from '../../views/SquadronEditor'
import SquadronTabs from '../../views/SquadronTabs'
import ResultPanel from '../../views/ResultPanel'
import SlotitemIcon from '../../views/components/SlotitemIcon'
import ProficiencyIcon from '../../views/components/ProficiencyIcon'

describe('view modules', () => {
  test('all poi-independent view modules load without errors', () => {
    const modules = [
      PlanePicker,
      CategoryTabs,
      PlaneList,
      SlotRow,
      SquadronEditor,
      SquadronTabs,
      ResultPanel,
      SlotitemIcon,
      ProficiencyIcon,
    ]
    for (const mod of modules) {
      expect(mod).toBeDefined()
    }
  })
})
