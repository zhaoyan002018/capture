const shortcutKey = {
    'sessions': { key: 'S', keyCode: 83, path: '/sessions' },
    'spiview' : { key: 'V', keyCode: 86, path: '/spiview' },
    'spigraph' : { key: 'G', keyCode: 71, path: '/spigraph/spigraphindex' },
    'connections': { key: 'C', keyCode: 67, path: '/connections' }
};

/**
 * 使用规则：
 *      配置路由对应的快捷键，[shift+X]的形式
 *
 *      q--FocusSearch;
 *      t--FocusTimeRange;
 *      h--help;
 *      u--hunt
 * */
/**
 * 常用键的keyCode对照表
 *       字母和数字键的键码值(keyCode)
     按键  键码	    按键	键码	按键	键码	按键	键码
     A      65	    J	    74	    S 	    83	    1	    49
     B	    66	    K	    75	    T	    84	    2	    50
     C	    67	    L	    76	    U	    85	    3	    51
     D	    68	    M	    77	    V	    86	    4	    52
     E	    69	    N	    78	    W	    87  	5   	53
     F	    70  	O	    79  	X   	88  	6	    54
     G  	71  	P   	80  	Y   	89  	7	    55
     H	    72	    Q	    81	    Z	    90	    8	    56
     I  	73	    R	    82  	0   	48  	9   	57
 *
 *      控制键键码值(keyCode)
     按键         键码	        按键	    键码	    按键	        键码	按键	键码
     BackSpace	    8	        Esc     	27	     Right Arrow	    39	    -_  	189
     Tab	        9	        Spacebar	32	        Dw Arrow	    40	    .>	    190
     Clear	        12	        Page Up 	33	        Insert	        45	    /?	    191
     Enter	        13	        Page Down	34	        Delete	        46	    `~	    192
     Shift	        16	        End	        35	        Num Lock	    144 	[{	    219
     Control	    17      	Home	    36	        ;:	            186	    \|  	220
     Alt	        18	        Left Arrow	37	        =+	            187	    ]}  	221
     Cape Lock	    20	        Up Arrow	38	        ,<	            188 	'"	    222
 * */
