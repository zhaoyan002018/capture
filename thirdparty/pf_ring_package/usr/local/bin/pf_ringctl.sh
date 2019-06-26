#!/usr/bin/env bash
PF_RING_NAME="pf_ring"
PF_RING_MOD="/usr/local/dps/driver/pf_ring.ko"
PF_RING_CONFIG_DIR="/etc/pf_ring"
PF_RING_CONF_FILE="$PF_RING_CONFIG_DIR/pf_ring.conf"
if [ -f /etc/init.d/functions ]; then
	DISTRO="centos"
	. /etc/init.d/functions
fi
check_pf_ring() {
	# check the module status
	ERROR=0
	WARNING=0
	RETVAL=0
	if [ $1 == "start" ] && [ `lsmod | grep ^${PF_RING_NAME} | wc -l ` -gt 0 ]; then
		MSG="PF_RING already loaded."
		WARNING=1
		RETVAL=1
	elif [ $1 == "stop" ] && [ `lsmod | grep ^${PF_RING_NAME} | wc -l ` -le 0 ]; then
		MSG="PF_RING already unloaded."
		WARNING=1
		RETVAL=1
	fi

	if [ ${ERROR} -gt 0 ]; then
        echo -n ${MSG}
        echo_failure; echo
        exit 99
	elif [ ${WARNING} -gt 0 ]; then
		echo -n "${MSG}"
		echo_success && echo
	fi

	return $RETVAL
}

start_pf_ring() {
    lsmod | grep pf_ring && rmmod pf_ring
    PARAM="$(cat $PF_RING_CONF_FILE)"
    /sbin/insmod $PF_RING_MOD $PARAM
    if [ `lsmod | grep ^${PF_RING_NAME} | wc -l ` -le 0 ] ; then
        # PF_RING not loaded. Exiting
        MSG="Unable to load PF_RING. Exiting"
        echo -n ${MSG}
        echo_failure; echo
        exit 99
    fi
 }



stop_pf_ring() {

    echo -n "Stopping PF_RING module: "

	check_pf_ring stop

	if [ $? -ne 0 ]; then
		return
	fi
	NUM="$(grep pf_ring /proc/modules|wc -l)"
	if [ $NUM -gt 0 ]; then
	    /usr/sbin/rmmod pf_ring
		NUM="$(grep pf_ring /proc/modules|wc -l)"
        if [ ${NUM} -gt 0 ]; then
            MSG="unable to unload PF_RING module"
            echo -n ${MSG}
            echo_failure
        fi
	fi
	echo_success && echo
}

case "$1" in
  start)
	start_pf_ring;
	;;

  stop)
	stop_pf_ring;
	;;

  restart)
	stop_pf_ring;
	start_pf_ring;
	;;

  status)
	get_status;
	;;

  *)
	echo "Usage: ${0} {start|stop|restart|status}"
	exit 1
esac
