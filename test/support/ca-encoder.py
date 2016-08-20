#!/usr/bin/env python

# @see https://natronics.github.io/blag/2014/gps-prn/
def shift(register, feedback, output):
    """GPS Shift Register

    :param list feedback: which positions to use as feedback (1 indexed)
    :param list output: which positions are output (1 indexed)
    :returns output of shift register:

    """

    # calculate output
    out = [register[i-1] for i in output]
    if len(out) > 1:
        out = sum(out) % 2
    else:
        out = out[0]

    # modulo 2 add feedback
    fb = sum([register[i-1] for i in feedback]) % 2

    # shift to the right
    for i in reversed(range(len(register[1:]))):
        register[i+1] = register[i]

    # put feedback in position 1
    register[0] = fb

    return out

# init registers
G1 = [1 for i in range(10)]
SV1_G2 = [1 for i in range(10)]
SV26_G2 = [1 for i in range(10)]

sv1_g2_output = [1]
sv26_g2_output = [1]
ca = []
for i in range(1022):
    g1 = shift(G1, [3,10], [10]) #feedback 3,10, output 10
    g2 = shift(SV1_G2, [2,3,6,8,9,10], [2,6]) #feedback 2,3,6,8,9,10, output 2,6 for sat 1
    sv1_g2_output.append(g2)
    ca.append((g1 + g2) % 2)

    sv26_g2 = shift(SV26_G2, [2,3,6,8,9,10], [6,8])
    sv26_g2_output.append(sv26_g2)

print 'SV 1:'
print sv1_g2_output[0:30]
print int(''.join(map(str, sv1_g2_output)), 2)

print 'SV 26:'
print sv26_g2_output[0:30]
print int(''.join(map(str, sv26_g2_output)), 2)

print 'C/A @ SV 1'
print ca
print '0b' + ''.join(map(str, ca))
