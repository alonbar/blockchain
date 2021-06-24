def test_consistency(n, LOGS, rep, subtest):
    # Implement
    current_full_log = LOGS[0][0]
    for round in range(len(LOGS)):
        for node in range(len(LOGS[round])):
            if len(LOGS[round][node]) <= len(current_full_log):
                if not '|'.join(current_full_log).startswith('|'.join(LOGS[round][node])):
                    # print('1: ', LOGS[round][node])
                    # print('2: ', current_full_log)
                    return False
            else:
                if not '|'.join(LOGS[round][node]).startswith('|'.join(current_full_log)):
                    return False
                current_full_log = LOGS[round][node]
    return True

LOGS = [[[], ['spreadings', 'speaker'], []],
 [['spreadings'], ['spreadings', 'speaker', 'camera', 'catches'], []],
 [['spreadings'], ['spreadings', 'speaker', 'camera', 'catches'], []],
 [['spreadings', 'speaker'],
  ['spreadings',
   'speaker',
   'camera',
   'catches',
   'sit',
   'everything',
   'xxx',
   'hidings'],
  ['spreadings']],
 [['spreadings', 'speaker', 'camera'],
  ['spreadings',
   'speaker',
   'camera',
   'catches',
   'sit',
   'everything',
   'because',
   'hidings'],
  ['spreadings', 'speaker', 'camera']]]
print(test_consistency(None, LOGS, None, None))
# print(len(['1', '2']))