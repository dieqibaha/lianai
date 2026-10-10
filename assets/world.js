/*
  场景配置：新增地点时，在 scenes 中加入背景图、类型和热点；
  按需将场景加入 map.stops 或车站 hotspots。
  背景路径独立配置，替换风景只改 background。
*/
window.GAME_WORLD = {
  map: {
    name: '沿海线',
    background: 'assets/map-3d.png',
    stops: [
      { id: 'zhanjiang', label: '湛江站', region: '广东', x: 24, y: 67 },
      { id: 'linyi', label: '临沂站', region: '山东', x: 77, y: 31 }
    ]
  },
  scenes: {
    zhanjiang: {
      id: 'zhanjiang', type: 'station', name: '湛江站', region: '广东',
      background: 'assets/zhanjiang-3d.png',
      hotspots: [
        { label: '学校', kind: 'school', x: 76, y: 44, target: 'school', icon: '↗' }
      ]
    },
    linyi: {
      id: 'linyi', type: 'station', name: '临沂站', region: '山东',
      background: 'assets/linyi-3d.png',
      hotspots: [
        { label: '怜爱的家', kind: 'home', x: 83, y: 55, target: 'home', icon: '➜' }
      ]
    },
    home: {
      id: 'home', type: 'home', name: '怜爱的家', region: '临沂',
      background: 'assets/home-3d.png',
      actor: { name: '怜爱', image: 'assets/lianai-3d.png', x: 76, bottom: 9 },
      cat: {
        name: '鼠标', sleep: 'assets/kitty-sleep.png', awake: 'assets/kitty-awake.png',
        x: 29, bottom: 16, width: 24,
        actions: [
          { id: 'roll', label: '打滚', icon: '⟳', line: '鼠标在红色猫窝里打了个滚。' },
          { id: 'meow', label: '喵一声', icon: '♫', line: '鼠标醒过来，轻轻地喵了一声。' },
          { id: 'spin', label: '转圈', icon: '✧', line: '鼠标从窝里起来，转了一圈。' }
        ]
      }
    },
    school: {
      id: 'school', type: 'school', name: '学校', region: '湛江',
      background: 'assets/school-3d.png',
      actor: { name: '男主', image: 'assets/hero-3d.png', x: 69, bottom: 11 },
      dialogue: {
        hello: '你来啦。我刚下课。',
        wave: '这边！海风正好，一起走走吗？',
        chat: '沿着操场走一小段，刚好能看见日落。'
      }
    }
  }
};
