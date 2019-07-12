cc_binary(
	name = 'zlogtest',
	srcs = ['zlogtest.c'],
	deps = [
		'#zlog',
		'#pthread',
		'#glib-2.0',
	],
	extra_linkflags = [
	'-L/home/dps/thirdparty/zlog-latest-stable/src',
	'-L/home/dps/thirdparty/glib-2.56.2/glib/.libs'
	],
	dynamic_link=True,
	export_dynamic=True,
)
